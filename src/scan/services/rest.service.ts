import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

import { toISODateString } from '@helpers/js.helper';
import { AuthenticationService } from '@services/authentication.service';
import { ErrorService } from '@services/error.service';
import { ReferenceDateService } from '@services/reference-date.service';
import { API_AUTHORIZATION } from '@models/common/api-authorization.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private isBusy = new BehaviorSubject<boolean>(false);
  isBusy$ = this.isBusy.asObservable();
  busyRequests = 0;

  private referenceDate: Date;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService,
    private referenceDateService: ReferenceDateService
  ) {
    this.initialize();
  }

  /**
   * Subscribes to the reference date service.
   *
   * @private
   * @memberof RestService
   */
  private initialize() {
    this.referenceDateService.getReferenceDate().subscribe(date => this.referenceDate = date);
  }

  /**
   * Performs a request to the backend server, specifying a reference date. If
   * the date isn't given, the current reference date is used.
   *
   * @template T The type of the expected response.
   * @param {string} url The URL of the request.
   * @param {string} [date=toISODateString(this.referenceDate)] An optional
   * date.
   * @param {any} [body] The body of the request.
   * @param {HttpHeaders} [headers=new HttpHeaders()] The headers to send with
   * the request.
   * @returns {Observable<T>} An Observable of the received response.
   *
   * @memberOf RestService
   */
  datedBackendRequest<T>(
    url: string,
    date: string = toISODateString(this.referenceDate),
    body?: any,
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<T> {
    return this.backendRequest<T>(url, body, headers.set('Data', date));
  }

  /**
   * Performs a request to the backend server.
   *
   * @template T The type of the expected response.
   * @param {string} url The URL of the request.
   * @param {any} [body] The body of the request.
   * @param {HttpHeaders} [headers=new HttpHeaders()] The headers to send with
   * the request.
   * @returns {Observable<T>} An Observable of the received response. The
   * Observable will contain an undefined reference in case of an empty
   * response.
   *
   * @memberOf RestService
   */
  backendRequest<T>(url: string, body?: any, headers: HttpHeaders = new HttpHeaders()): Observable<T> {
    return this.authenticationService.getSessionToken().pipe(
      switchMap(token => this.jsonRequest<T>(url, body, headers.set('Authorization', token))),
      catchError(this.errorService.handleError<T>(`backendRequest(${url})`, null))
    );
  }

  /**
   * Performs a `GET` request to the backend server, specifying a reference date.
   * If the date isn't given, the current reference date is used.
   *
   * @param {string} url The URL of the request.
   * @param {string} [date=toISODateString(this.referenceDate)] An optional
   * date.
   * @param {HttpHeaders} [headers] Optional headers to send with the request.
   * @returns {Observable<any>} An Observable of the received response.
   * @memberof RestService
   */
  datedBackendGetRequest(
    url: string,
    date: string = toISODateString(this.referenceDate),
    headers?: HttpHeaders
  ): Observable<any> {
    return this.backendGetRequest(`${url}/data/${date}`, headers);
  }

  /**
   * Performs a `GET` request to the backend server.
   *
   * @param {string} url The URL of the request.
   * @param {HttpHeaders} [headers=new HttpHeaders()] The headers to send with
   * the request.
   * @returns {Observable<any>} An Observable of the received response, or of
   * `null` in case of error.
   *
   * @memberOf RestService
   */
  backendGetRequest(url: string, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    headers = headers.set('Authorization', API_AUTHORIZATION); // FIXME move this somewhere safer
    return this.httpClient.get(url, { headers: headers }).pipe(
      catchError(this.errorService.handleError(`backendGetRequest("${url}")`, null))
    );
  }

  /**
   * Performs a `POST` request to the backend server, specifying a reference date.
   * If the date isn't given, the current reference date is used.
   *
   * @param {string} url The URL of the request.
   * @param {*} [body] An optional payload to send with the request.
   * @param {string} [date=toISODateString(this.referenceDate)] An optional
   * date.
   * @param {HttpHeaders} [headers] Optional headers to send with the request.
   * @returns {Observable<any>} An Observable of the received response.
   * @memberof RestService
   */
  datedBackendPostRequest(
    url: string,
    body?: any,
    date: string = toISODateString(this.referenceDate),
    headers?: HttpHeaders
  ): Observable<any> {
    return this.backendPostRequest(`${url}/data/${date}`, body, headers);
  }

  /**
   * Performs a `POST` request to the backend server.
   *
   * @param {string} url The URL of the request.
   * @param {*} [body] An optional payload to send with the request.
   * @param {HttpHeaders} [headers=new HttpHeaders()] The headers to send with
   * the request.
   * @returns {Observable<any>} An Observable of the received response, or of
   * `null` in case of error.
   *
   * @memberOf RestService
   */
  backendPostRequest(url: string, body?: any, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    headers = headers.set('Authorization', API_AUTHORIZATION); // FIXME move this somewhere safer
    return this.httpClient.post(url, body, { headers: headers }).pipe(
      catchError(this.errorService.handleError(`backendPostRequest("${url}")`, null))
    );
  }

  /**
   * Requests a JSON from the backend server and casts it to the specified
   * type.
   *
   * @template T The type to cast the expected response to.
   * @param {string} url The URL of the request.
   * @param {any} body The body of the request.
   * @param {HttpHeaders} [headers=new HttpHeaders()] The headers to send with
   * the request.
   * @returns {Observable<T>} An Observable of the received response. The
   * Observable will contain an undefined reference in case of an empty
   * response.
   *
   * @memberOf RestService
   */
  private jsonRequest<T>(url: string, body?: any, headers: HttpHeaders = new HttpHeaders()): Observable<T> {
    headers = headers
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    this.setBusy();
    return this.httpClient.post(url, body, { headers: headers, responseType: 'text' }).pipe(
      map(response => this.parseJsonString(response) as T),
      catchError(this.errorService.handleError<T>(`jsonRequest(${url})`, null)),
      finalize(() => this.setNotBusy())
    );
  }

  /**
   * Verifies whether a string is a valid JSON representation and double-quotes
   * it in case it isn't, then parses it.
   *
   * @private
   * @param {string} json The string to be tested and parsed.
   * @returns The result of parsing the normalized string.
   *
   * @memberOf RestService
   */
  private parseJsonString(json: string): any {
    if (json && json.length > 0) {
      try {
        return JSON.parse(['[', '{', '"'].includes(json[0]) ? json : `"${json}"`);
      } catch (err) {
        console.warn(`parseJsonString(): Couldn't parse the string "${json}" as JSON.`);
      }
    } else {
      console.warn('parseJsonString(): The received JSON is undefined or empty');
    }
    return null;
  }

  changeBusy(isBusy: boolean) {
    this.isBusy.next(isBusy);
  }

  setBusy() {
    this.busyRequests++;
    this.changeBusy(true);
  }

  setNotBusy() {
    if (this.busyRequests > 0) { this.busyRequests--; }
    if (this.busyRequests === 0) { this.changeBusy(false); }
  }

}
