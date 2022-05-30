import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { HighEndDataCenter, HighEndEnvironment, HighEndHost } from '@models/high-end';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class HighEndService {

  private highEndEnvironment: Observable<HighEndEnvironment>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService
  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service to clear the cache when the date
   * changes.
   *
   * @private
   * @memberof HighEndService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached High End Environment topology.
   *
   * @private
   * @memberof HighEndService
   */
  private clearCache() {
    this.highEndEnvironment = null;
  }

  /**
   * Gets and caches the topology of the High End Environment, for an
   * optionally given date.
   *
   * @param {string} [date] The optional
   * date.
   * @returns {Observable<HighEndEnvironment>} An `Observable` of the
   * topology of the High End Environment.
   * @memberof HighEndService
   */
  getHighEndEnvironment(date?: string): Observable<HighEndEnvironment> {
    if (!this.highEndEnvironment) {
      this.highEndEnvironment = this.restService
        .datedBackendGetRequest(REMOTE_ROUTES.highEndBSB, date).pipe(
          map(response => (!!response ? response : []) as HighEndDataCenter[]),
          map(dataCenters => new HighEndEnvironment(
            dataCenters.map(dataCenter => new HighEndDataCenter().deserialize(dataCenter)),
            date
          )),
          publishReplay(1),
          refCount()
        );
    }
    return this.highEndEnvironment;
  }

  /**
   * Gets the guests associated with the hosts referenced by the given IDs,
   * for an optional date.
   *
   * @param {string} hostIds A comma-separated list of host IDs.
   * @param {string} [date] The optional
   * date.
   * @returns {Observable<OldHighEndGuest[]>} An `Observable` of a list of the
   * guests associated to the relevant hosts.
   * @memberof HighEndService
   */
  getHighEndHostsByIds(hostIds: number[]): Observable<HighEndHost[]> {
    return this.restService.backendPostRequest(REMOTE_ROUTES.highEndHostsByIds, hostIds).pipe(
      map(response => (!!response ? response : []) as HighEndHost[]),
      map(guests => guests.map(guest => new HighEndHost().deserialize(guest)))
    );
  }

}
