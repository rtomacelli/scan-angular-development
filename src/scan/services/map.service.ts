import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MapCoordinates } from '@models/map-common';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private mapMode = new Subject<string>();

  constructor(
    private restService: RestService
  ) { }

  /**
   * Loads the lists of components and apps comprising the map of a given
   * application interface element, for an optionally given date.
   *
   * @param {number} elementCode The ID of the application interface element.
   * @param {string} [date] The optional date.
   * @returns {Observable<MapCoordinates>} An `Observable` containing the lists
   * of components and apps for the desired application interface map.
   * @memberof MapService
   */
  getInterfaceMapComponents(elementCode: number, date?: string): Observable<MapCoordinates> {
    if (elementCode) {
      return this.restService.datedBackendGetRequest(`${REMOTE_ROUTES.interfaceMap}/${elementCode}`, date).pipe(
        map((coordinates: any) => new MapCoordinates().deserialize(coordinates))
      );
    } else {
      return of(undefined);
    }
  }

  /**
   * Loads the lists of components and apps comprising the map of a given list
   * of apps (either a single app or those of a business service), for an
   * optionally given date.
   *
   * @param {string[]} apps A list of one or more app codes.
   * @param {string} [date] The optional date.
   * @returns {Observable<MapCoordinates>} An `Observable` containing the lists
   * of components and apps for the desired apps map.
   * @memberof MapService
   */
  getAppsMapComponents(apps: string[], date?: string): Observable<MapCoordinates> {
    if (apps && Array.isArray(apps) && apps.length > 0) {
      return this.restService.datedBackendPostRequest(REMOTE_ROUTES.appsMap, apps, date).pipe(
        map((coordinates: any) => new MapCoordinates().deserialize(coordinates))
      );
    } else {
      return of(undefined);
    }
  }

  /**
   * Sets the current map mode (either 'compact' or 'complete').
   *
   * @param {string} mode The new mode to set.
   * @memberof MapService
   */
  setMapMode(mode: string) {
    this.mapMode.next(mode);
  }

  /**
   * Retrieves the current map mode (either 'compact' or 'complete').
   *
   * @returns {Observable<string>} An `Observable` of the current map mode.
   * @memberof MapService
   */
  getMapMode(): Observable<string> {
    return this.mapMode.asObservable();
  }

}
