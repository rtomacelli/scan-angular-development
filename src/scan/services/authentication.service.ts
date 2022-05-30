import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';

// import { environment } from '@environments/environment';
import { formatUserAttributes, getCookie } from '@helpers/security.helper';
import { DEFAULT_USER, ERROR_USER, Person, User } from '@models/admin';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { ErrorService } from '@services/error.service';
import { APIVersion } from '@models/common/api-version.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user: Observable<User>;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) { }

  /**
   * Gets and saves the active user.
   *
   * @returns {Observable<User>} An Observable of the active user.
   *
   * @memberOf AuthenticationService
   */
  getUser(): Observable<User> {
    if (!this.user) {
      // this.user = (environment.production ? this.getUserFromSSO() : of(DEFAULT_USER)).pipe(  // TODO Implement security
      this.user = of(DEFAULT_USER).pipe(
        // switchMap(user => this.registerUser(user)), // TODO Implement security
        catchError(this.errorService.handleError('getUser()', ERROR_USER)),
        publishReplay(1),
        refCount()
      );
    }
    return this.user;
  }

  /**
   * Fetches the SSO user attributes and creates a `User` instance from them.
   *
   * @private
   * @returns {Observable<User>} An Observable of the user
   * represented by the loaded attributes.
   *
   * @memberOf AuthenticationService
   */
  private getUserFromSSO(): Observable<User> {
    const headers = new HttpHeaders()
      .set('BBSSOtoken', getCookie('BBSSOToken')) // TODO: test this later
      .set('Accept', 'text/plain')
      .set('Content-Type', 'text/plain');
    return this.httpClient.post(REMOTE_ROUTES.userAttributes, null, { headers: headers, responseType: 'text' }).pipe(
      map(response => User.fromAttributes(formatUserAttributes(response as string)) || ERROR_USER),
      catchError(this.errorService.handleError<User>('getUserAttributes()', ERROR_USER))
    );
  }

  /**
   * Requests the current user's registration with the backend, and saves the
   * user's session token and profiles;
   *
   * @private
   * @param {User} user The current user's object, with their UID.
   * @returns {Observable<User>} An `Observable` of the registered user's
   * object, containing their session token and profiles.
   *
   * @memberOf AuthenticationService
   */
  private registerUser(user: User): Observable<User> {
    if (user.uid) {
      const headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');
      return this.httpClient.post<Person>(REMOTE_ROUTES.registerUser, user.toPerson(), { headers: headers }).pipe(
        map(person => user.updateWithPerson(person)),
        catchError(this.errorService.handleError<User>('registerUser()', ERROR_USER))
      );
    }
    return of(ERROR_USER);
  }

  /**
   * Gets the user's SSO token.
   *
   * @returns {Observable<string>} An Observable of the user's SSO token.
   *
   * @memberOf AuthenticationService
   */
  getSsoToken(): Observable<string> {
    if (this.user) {
      return this.user.pipe(map(user => user.ssoToken));
    }
    return of(null);
  }

  /**
   * Gets the user's session token.
   *
   * @returns {Observable<string>} An Observable of the user's session token.
   *
   * @memberOf AuthenticationService
   */
  getSessionToken(): Observable<string> {
    if (this.user) {
      return this.user.pipe(map(user => user.sessionToken));
    }
    return of(null);
  }

  /**
   * Gets the user's ID.
   *
   * @returns {Observable<string>} An Observable of the user's ID.
   *
   * @memberOf AuthenticationService
   */
  getUID(): Observable<string> {
    if (this.user) {
      return this.user.pipe(map(user => user.uid));
    }
    return of(null);
  }

  /**
   * Determines whether the current user's authentication token is still valid.
   *
   * TODO Still to be implemented: depending on new security backend.
   *
   * @returns {Observable<boolean>} An Observable of a boolean indicating the
   * validity of the token.
   *
   * @memberOf AuthenticationService
   */
  isSsoTokenValid(): Observable<boolean> {
    console.warn('Method `isSsoTokenValid()` not implemented.');
    return of(true);
  }

  getAPIVersion(): Observable<APIVersion> {
    return this.httpClient.get(REMOTE_ROUTES.projectVersion).pipe(
      map(response => new APIVersion().deserialize(response))
    );
  }

}
