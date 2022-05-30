import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { DiskStorageSubsystem, DiskStorageDataCenter } from '@models/disk-storage';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class DiskStorageService {

  private diskStorageSubsystem: Observable<DiskStorageSubsystem>;

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
   * @memberof DiskStorageService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached Disk Storage Subsystem topology.
   *
   * @private
   * @memberof DiskStorageService
   */
  private clearCache() {
    this.diskStorageSubsystem = null;
  }

  /**
   * Gets and caches the topology of the Disk Storage Subsystem, for an
   * optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<DiskStorageSubsystem>} An `Observable` with the
   * topology of the Disk Storage Subsystem.
   * @memberof DiskStorageService
   */
  getDiskStorageSubsystem(date?: string): Observable<DiskStorageSubsystem> {
    if (!this.diskStorageSubsystem) {
      this.diskStorageSubsystem = this.restService.datedBackendGetRequest(REMOTE_ROUTES.diskStorage, date).pipe(
        map(response => (!!response ? response : []) as DiskStorageDataCenter[]),
        map(dataCenters => new DiskStorageSubsystem(
          dataCenters.map(dataCenter => new DiskStorageDataCenter().deserialize(dataCenter)),
          date
        )),
        publishReplay(1),
        refCount()
      );
    }
    return this.diskStorageSubsystem;
  }

}
