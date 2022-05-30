import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { App, AppPortfolio, BusinessService, AreaOfInterest } from '@models/app-portfolio';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AppPortfolioService {

  private appPortfolio: Observable<AppPortfolio>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService
  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service to clear the caches when the date
   * changes.
   *
   * @private
   * @memberof AppPortfolioService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(() => this.clearCache());
  }

  /**
   * Clears the cached Application Portfolio data.
   *
   * @private
   * @memberof AppPortfolioService
   */
  private clearCache() {
    this.appPortfolio = null;
  }

  /**
   * Gets and caches the full Application Portfolio, for an optionally given
   * date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<AppPortfolio>} An Observable of the full Application
   * Portfolio, or of an undefined reference otherwise.
   *
   * @memberOf AppPortfolioService
   */
  getAppPortfolio(date?: string): Observable<AppPortfolio> {
    if (!this.appPortfolio) {
      this.appPortfolio = this.restService.datedBackendGetRequest(REMOTE_ROUTES.appPortfolio, date).pipe(
        map(response => new AppPortfolio().deserialize(response)),
        publishReplay(1),
        refCount()
      );
    }
    return this.appPortfolio;
  }

  /**
   * Gets the full `App` list for an optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<OldApp[]>} An Observable of the full `App` list for
   * the given date.
   *
   * @memberOf AppPortfolioService
   */
  getAllApps(date?: string): Observable<App[]> {
    return this.getAppPortfolio(date).pipe(
      map(appPortfolio => appPortfolio.apps)
    );
  }

  /**
   * Gets an `App` by code, for an optionally given date.
   *
   * @param {string} code The application's code.
   * @param {string} [date] The optional date.
   * @returns {Observable<App>} An Observable of the `App`, if found, or of an
   * undefined reference otherwise.
   *
   * @memberOf AppPortfolioService
   */
  getApp(code: string, date?: string): Observable<App> {
    return this.getAllApps(date).pipe(
      map(apps => apps.find(app => app.codigo === code))
    );
  }

  /**
   * Gets a list of `App`s by a list of codes, for an optionally given date.
   *
   * @param {string[]} codes The list o app codes.
   * @param {string} [date] The optional date.
   * @returns {Observable<App[]>} An `Observable` of the list of apps, if
   * they're found, or of an empty array otherwise.
   *
   * @memberOf AppPortfolioService
   */
  getApps(codes: string[], date?: string): Observable<App[]> {
    return this.getAllApps(date).pipe(
      map(apps => apps.filter(app => codes.includes(app.codigo)))
    );
  }

  /**
   * Gets the whole list of `BusinessService`s from the Application Portfolio,
   * for an optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<BusinessService[]>} An Observable of the list of
   * Business Services, or of an empty array in case of error.
   *
   * @memberOf AppPortfolioService
   */
  getAllBusinessServices(date?: string): Observable<BusinessService[]> {
    return this.getAppPortfolio(date).pipe(
      map(appPortfolio => appPortfolio.businessServices)
    );
  }

  /**
   * Gets a `BusinessService` by code from the Application Portfolio, for an
   * optionally given date.
   *
   * @param {string} code The code of the desired Business Service.
   * @param {string} [date] The optional date.
   * @returns {Observable<BusinessService>} An `Observable` of the desired
   * Business Service, or an undefined reference in case of error.
   *
   * @memberof AppPortfolioService
   */
  getBusinessService(code: string, date?: string): Observable<BusinessService> {
    return this.getAllBusinessServices(date).pipe(
      map(services => services.find(service => service.codigo === code))
    );
  }

  /**
   * Gets one or multiple `BusinessService`s by code from the Application
   * Portfolio, for an optionally given date.
   *
   * @param {string[]} codes The codes of the desired Business Services.
   * @param {string} [date] The optional date.
   * @returns {Observable<BusinessService[]>} An `Observable` of the desired
   * Business Services, or an empty array in case of error.
   *
   * @memberof AppPortfolioService
   */
  getBusinessServices(codes: string[], date?: string): Observable<BusinessService[]> {
    return this.getAllBusinessServices(date).pipe(
      map(services => services.filter(service => codes.includes(service.codigo)))
    );
  }

  /**
   * Gets the whole list of `AreaOfInterest`s from the Application Portfolio,
   * for an optionally given date.
   *
   * @param {string} [date] The optional date.
   * @returns {Observable<AreaOfInterest[]>} An Observable of the list of
   * Areas of Interest, or of an empty array in case of error.
   *
   * @memberOf AppPortfolioService
   */
  getAllAreasOfInterest(date?: string): Observable<AreaOfInterest[]> {
    return this.getAppPortfolio(date).pipe(
      map(appPortfolio => appPortfolio.areasOfInterest)
    );
  }

  /**
   * Gets an `AreaOfInterest` by code from the Application Portfolio, for an
   * optionally given date.
   *
   * @param {string} code The code of the desired Business Service.
   * @param {string} [date] The optional date.
   * @returns {Observable<AreaOfInterest>} An `Observable` of the desired
   * Area of Interest, or an undefined reference in case of error.
   *
   * @memberof AppPortfolioService
   */
  getAreaOfInterest(code: string, date?: string): Observable<AreaOfInterest> {
    return this.getAllAreasOfInterest(date).pipe(
      map(areas => areas.find(area => area.codigo === code))
    );
  }

  /**
   * Gets one or multiple `AreaOfInterest`s by code from the Application
   * Portfolio, for an optionally given date.
   *
   * @param {string[]} codes The codes of the desired Areas of Interest.
   * @param {string} [date] The optional date.
   * @returns {Observable<AreaOfInterest[]>} An `Observable` of the desired
   * Areas of Interest, or an empty array in case of error.
   *
   * @memberof AppPortfolioService
   */
  getAreasOfInterest(codes: string[], date?: string): Observable<AreaOfInterest[]> {
    return this.getAllAreasOfInterest(date).pipe(
      map(areas => areas.filter(area => codes.includes(area.codigo)))
    );
  }

}
