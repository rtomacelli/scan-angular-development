import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { User } from '@models/admin';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'scan-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  menuItems: MenuItem[];
  user: User;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  // tslint:disable: max-line-length
  ngOnInit() {
    this.authenticationService.getUser().subscribe({
      next: user => {
        if (user) {
          this.user = user;
          this.menuItems = [
            {
              label: 'Perfil',
              items: [
                { label: this.user.name, disabled: true, styleClass: 'text' },
                { label: this.user.commission, disabled: true, styleClass: 'text' },
                { label: this.user.department, disabled: true, styleClass: 'text' },
                { label: 'Humanograma', title: 'Abrir Perfil', icon: 'fa fa-fw fa-external-link', url: this.user.profileUrl, target: 'humanograma' }
              ]
            },
            this.user.phones.length && {
              label: 'Telefones',
              items: this.user.phones.map(p => ({ label: p, disabled: true, styleClass: 'text' }))
            },
            { separator: true },
            { label: 'Sessão', items: [{ label: 'Sair', title: 'Encerrar a Sessão', icon: `fa fa-fw fa-sign-out`, url: REMOTE_ROUTES.logout }] }
          ];
        }
      }
    });
  }

}
