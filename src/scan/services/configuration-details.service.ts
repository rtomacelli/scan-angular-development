import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationDetails } from '@models/configuration-details';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDetailsService {

  constructor(
    private restService: RestService
  ) { }

  /**
   * Retrieves details for a network element in the logical infrastructure
   * layer, for an optional date.
   *
   * @param {number} elementId The ID of the network element.
   * @param {string} [date] The optional date.
   * @returns {Observable<OldConfigurationDetails>} An `Observable` of the network
   * element's details.
   * @memberof ConfigurationDetailsService
   */
  getLogicalNetworkDetails(elementId: number): Observable<ConfigurationDetails> {
    return this.restService.backendGetRequest(`${REMOTE_ROUTES.logicalNetworkDetails}/${elementId}`).pipe(
      map((details: ConfigurationDetails) => (!!details ? details : {}) as ConfigurationDetails)
    );
  }

  /**
   * Retrieves details for an application interface element in the logical
   * infrastructure layer, for an optional date.
   *
   * @param {number} elementId The ID of the application interface element.
   * @param {string} [date] The optional date.
   * @returns {Observable<OldConfigurationDetails>} An `Observable` of the
   * application interface element's details.
   * @memberof ConfigurationDetailsService
   */
  getLogicalInterfaceDetails(elementId: number): Observable<ConfigurationDetails> {
    return this.restService.backendGetRequest(`${REMOTE_ROUTES.logicalInterfaceDetails}/${elementId}`).pipe(
      map((details: ConfigurationDetails) => (!!details ? details : {}) as ConfigurationDetails)
    );
  }

}
