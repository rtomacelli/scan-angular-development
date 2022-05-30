import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { TapeLibraryDataCenter, TapeLibrarySystem } from '@models/tape-library';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class TapeLibraryService {

  private tapeLibrarySystem: Observable<TapeLibrarySystem>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service to clear the cache when the date
   * changes.
   *
   * @private
   * @memberof TapeLibraryService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached Tape Library topology.
   *
   * @private
   * @memberof TapeLibraryService
   */
  private clearCache() {
    this.tapeLibrarySystem = null;
  }

  /**
   * Gets and caches the Tape Library topology, for an optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<TapeLibrarySystem>} An `Observable` of the tape
   * library topology.
   * @memberof TapeLibraryService
   */
  getTapeLibrarySystem(date?: string): Observable<TapeLibrarySystem> {
    if (!this.tapeLibrarySystem) {
      this.tapeLibrarySystem = this.restService.datedBackendGetRequest(REMOTE_ROUTES.tapeLibrary, date).pipe(
        map(response => (!!response ? response : []) as TapeLibraryDataCenter[]),
        map(dataCenters => new TapeLibrarySystem(
          dataCenters.map(dataCenter => new TapeLibraryDataCenter().deserialize(dataCenter)),
          date
        )),
        publishReplay(1),
        refCount()
      );
    }
    return this.tapeLibrarySystem;
  }

}
