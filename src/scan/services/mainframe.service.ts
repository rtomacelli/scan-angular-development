import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { MainframeDataCenter, MainframeEnvironment, MainframeImage } from '@models/mainframe';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ErrorService } from '@services/error.service';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class MainframeService {

  private mainframeEnvironment: Observable<MainframeEnvironment>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService,
    private errorService: ErrorService
  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service to clear the cache when the date
   * changes.
   *
   * @private
   * @memberof MainframeService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached Mainframe Environment topology.
   *
   * @private
   * @memberof MainframeService
   */
  private clearCache() {
    this.mainframeEnvironment = null;
  }

  /**
   * Gets and caches the Mainframe Environment topology, for an optionally
   * given date.
   *
   * @param {string} [date] The optional
   * date.
   * @returns {Observable<OldMainframeEnvironment>} An `Observable` of the
   * Mainframe Environment topology.
   * @memberof MainframeService
   */
  getMainframeEnvironment(date?: string): Observable<MainframeEnvironment> {
    if (!this.mainframeEnvironment) {
      this.mainframeEnvironment = this.restService.datedBackendGetRequest(REMOTE_ROUTES.mainframe, date).pipe(
        map(response => (!!response ? response : []) as MainframeDataCenter[]),
        map(dataCenters => new MainframeEnvironment(
          dataCenters.map(dataCenter => new MainframeDataCenter().deserialize(dataCenter)),
          date
        )),
        publishReplay(1),
        refCount()
      );
    }
    return this.mainframeEnvironment;
  }

  getImagesByName(imageNames: string[], date?: string): Observable<MainframeImage[]> {
    return this.restService.datedBackendPostRequest(REMOTE_ROUTES.mainframeImagesByName, imageNames, date).pipe(
      map((response: any[]) => !!response ? response : []),
      map(images => images.map(image => new MainframeImage().deserialize(image)))
    );
  }

}
