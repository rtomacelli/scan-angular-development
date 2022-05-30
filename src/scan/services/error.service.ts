import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { alertAndLogout } from '@helpers/security.helper';

interface FormattedError {
  'status': string;
  'message': string;
  'error': string;
  'url': string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  /**
   * Creates and returns an error handling function which, in turn, provides an
   * Observable of an optional default substitute value.
   *
   * TODO Improve HTTP error detection and handling
   *
   * @template T The type of the substitute value.
   * @param {string} [operation='operation'] The name of the attempted operation.
   * @param {T} [result] An Observable of the optional substitute value.
   * @returns {(error: any) => Observable<T>} An error handler function.
   *
   * @memberOf AuthenticationService
   */
  handleError<T>(operation: string = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      const formattedError = this.formatError(error);
      const warningMessage = `${new Date().toISOString()} - ${operation} failed: ${error.message}. ${formattedError.error}.`;

      console.error(error);         // TODO send error to remote logging infrastructure
      console.warn(warningMessage); // TODO better job of transforming error for user consumption

      if (formattedError.error.includes('O token não é válido')) { // TODO extract this constant
        return this.alertAndLogout<T>('Sua sessão foi encerrada.', result);
      } else if (formattedError.status === '0 - Unknown Error') {
        return this.alertAndLogout('O servidor de dados não está respondendo.', result);
      }

      // Let the app keep running by returning another result
      return of(result as T);
    };
  }

  // TODO Make a proper dialog later
  private alertAndLogout<T>(message: string, result: T) {
    alertAndLogout(message);
    return of(result as T);
  }

    // alert('Ocorreu um erro na autorização do usuário.\nSua sessão foi encerrada.');
    // SecurityHelper.logout();

  private formatError(error: any): FormattedError {
    let errorDescription: string;
    if (error.error) {
      if (typeof error.error === 'string') {
        errorDescription = error.error.split('\n')[0].replace(/.*<h1>(.*)<\/h1>.*/, '$1');
      } else {
        errorDescription = JSON.stringify(error.error);
      }
    }

    const formattedError = {
      status: `${error.status} - ${error.statusText}`,
      message: error.message || '',
      error: errorDescription || '',
      url: error.url
    };

    return formattedError;
  }
}
