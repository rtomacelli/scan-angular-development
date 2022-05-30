import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad, /* Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router, */ UrlTree
} from '@angular/router';
// import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// import { SecurityHelper } from '@helpers/security.helper';
// import { AuthorizationService } from '@services/authorization.service';
// import { ErrorService } from '@services/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    // private authorizationService: AuthorizationService,
    // private errorService: ErrorService,
    // private router: Router
  ) { }

  canActivate(
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkProfile();
  }

  canActivateChild(
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkProfile();
  }

  canLoad(
    // route: Route,
    // segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkProfile();
  }

  /**
   * TODO Check user profiles here.
   *
   * This method wasn't supposed to validate any tokens: that's the backend's responsibility.
   *
   * Instead it must check whether the current user's profiles allow them to access a given
   * feature.
   */
  private checkProfile(): Observable<boolean> {
    return of(true);
    // return this.authorizationService.hasScanToken().pipe(
    //   tap(hasToken => {
    //     if (!hasToken) {
    //       alert('Sua sessão foi encerrada.'); // TODO make a proper modal
    //       SecurityHelper.logout();
    // }
    //   }),
    //   catchError(() => {
    //     alert('Ocorreu um erro na validação do token.\nSua sessão foi encerrada.');
    //     return this.errorService.handleError<boolean>('validateTokens()', false);
    //   })
    // );
    // --------------------------------------------------------------------------------------------
    // if (this.authorizationService.hasScanToken()) {
    //   return true;
    // } else {
    //   console.log('validateTokens() -> ScanComponent.logout()');
    //   // ScanComponent.logout()
    // }
  }

}
