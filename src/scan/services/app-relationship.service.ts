import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { App } from '@models/app-portfolio';

@Injectable({
  providedIn: 'root'
})
export class AppRelationshipService {

  private hoveredApp = new Subject<App>();
  private relatedApps = new Subject<App[]>();
  private mapApps = new BehaviorSubject<App[]>([]);
  private highlightedAppCodes = new Subject<string[]>();

  /**
   * Sets the currently hovered app.
   *
   * @param {App} app The hovered app.
   * @memberof AppRelationshipService
   */
  setHoveredApp(app: App) {
    this.hoveredApp.next(app);
  }

  /**
   * Clears the currently hovered app, i.e. no app is currently hovered.
   *
   * @memberof AppRelationshipService
   */
  clearHoveredApp() {
    this.hoveredApp.next();
  }

  /**
   * Gets the currently hovered app.
   *
   * @returns {Observable<App>} An `Observable` of the currently hovered app.
   * @memberof AppRelationshipService
   */
  getHoveredApp(): Observable<App> {
    return this.hoveredApp.asObservable();
  }

  setRelatedApps(apps: App[]) {
    this.relatedApps.next(apps);
  }

  clearRelatedApps() {
    this.relatedApps.next();
  }

  getRelatedApps(): Observable<App[]> {
    return this.relatedApps.asObservable();
  }

  /**
   * Sets the app list of the current map.
   *
   * @param {App[]} apps The list of apps of the current map.
   * @memberof AppRelationshipService
   */
  setMapApps(apps: App[]) {
    this.mapApps.next(apps);
  }

  /**
   * Clears the list of apps of the current map.
   *
   * @memberof AppRelationshipService
   */
  clearMapApps() {
    this.mapApps.next([]);
  }

  /**
   * Retrieves the list of apps of the current map.
   *
   * @returns {Observable<App[]>} An `Observable` of the list of apps of the
   * current map.
   * @memberof AppRelationshipService
   */
  getMapApps(): Observable<App[]> {
    return this.mapApps.asObservable();
  }

  /**
   * Sets the list of codes of the currently highlighted apps.
   *
   * @param {string[]} appCodes The codes of the highlighted apps.
   * @memberof AppRelationshipService
   */
  setHighlightedAppCodes(appCodes: string[]) {
    this.highlightedAppCodes.next(appCodes);
  }

  /**
   * Clears the list of codes of the currently highlighted apps, i.e., no app
   * is currently highlighted.
   *
   * @memberof AppRelationshipService
   */
  clearHighlightedAppCodes() {
    this.highlightedAppCodes.next([]);
  }

  /**
   * Retrieves the list of codes of the currently highlighted apps.
   *
   * @returns {Observable<string[]>} An `Observable` of the list of codes of
   * the currently highlighted apps.
   * @memberof AppRelationshipService
   */
  getHighlightedAppCodes(): Observable<string[]> {
    return this.highlightedAppCodes.asObservable();
  }

}
