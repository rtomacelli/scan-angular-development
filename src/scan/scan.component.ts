import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '@environments/environment';
import { alertAndLogout } from '@helpers/security.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { User } from '@models/admin';
import { APIVersion } from '@models/common/api-version.model';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'scan-root',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  title = 'Scan';
  version = '';
  timestamp = '';
  userIsRegistered = false;
  env = environment;

  public constructor(
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { }

  /**
   * NOTE This is the application's entry point.
   *
   * @memberOf ScanComponent
   */
  ngOnInit() {
    this.authenticateUser();
  }

  /**
   * Gets and validates the currently logged user's data, then attempts to get
   * the backend version.
   *
   * TODO make a proper modal for the else block
   *
   * @private
   *
   * @memberOf ScanComponent
   */
  private authenticateUser() {
    this.authenticationService.getUser().subscribe(user => {
      const errorMessage = this.validateUserData(user);
      if (errorMessage.length === 0) {
        this.updateVersion();
      } else {
        alertAndLogout(errorMessage);
      }
    });
  }

  /**
   * Validates the user data and returns an appropriate error message.
   *
   * @private
   * @param {User} user The user whose data is to be validated.
   * @returns {string} The error message.
   * @memberof ScanComponent
   */
  private validateUserData(user: User): string {
    const conditions: ValidityCondition[] = [{
      isValid: !!user && !!user.uid,
      invalidMessage: 'não foi possível obter os dados do usuário'
    }, {
      isValid: !!user && !!user.sessionToken,
      invalidMessage: 'não foi possível obter um token de sessão'
    }];
    return validateData(conditions);
  }

  /**
   * Requests the current backend version number, confirming the user's
   * registration on success.
   *
   * @private
   *
   * @memberOf ScanComponent
   */
  private updateVersion() {
    this.authenticationService.getAPIVersion().subscribe(
      (api: APIVersion) => {
        this.userIsRegistered = true;
        this.version = `${api.version}/${environment.version}`;
        this.timestamp = api.time;
        this.titleService.setTitle(`${this.title} ${this.version}`);
      }
    );
  }

}
