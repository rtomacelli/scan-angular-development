import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { PaletteComponent } from '@modules/core/panels';
import { PreferencesComponent } from '@modules/settings/preferences/preferences.component';
import { SettingsComponent } from '@modules/settings/settings.component';
import { ROUTES } from '@routes/local.routes';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [{
      path: '', canActivateChild: [AuthGuard], children: [{
        path: ROUTES.settings.children.preferences.path,
        component: PreferencesComponent
      }, {
        path: ROUTES.settings.children.admin.path,
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canLoad: [AuthGuard]
      }, {
        path: ROUTES.settings.children.palette.path,
        component: PaletteComponent
      }, {
        path: '',
        redirectTo: ROUTES.settings.children.admin.path,
        pathMatch: 'full'
      }]
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule { }
