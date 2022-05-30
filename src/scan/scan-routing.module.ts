import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from '@modules/search';
import { AuthGuard } from '@guards/auth.guard';
import { NotFoundComponent } from '@modules/core/panels';
import { ROUTES } from '@routes/local.routes';

const routes: Routes = [
  {
    path: ROUTES.search.path,
    component: SearchComponent,
    canActivate: [AuthGuard]
  }, {
    path: ROUTES.settings.path,
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
    canLoad: [AuthGuard]
  }, {
    path: ROUTES.map.path,
    loadChildren: () => import('./modules/maps/maps.module').then(m => m.MapsModule),
    canLoad: [AuthGuard]
  }, {
    path: `${ROUTES.map.path}/:type/:key`,
    loadChildren: () => import('./modules/maps/maps.module').then(m => m.MapsModule),
    canLoad: [AuthGuard]
  }, {
    path: '',
    redirectTo: `/${ROUTES.search.path}`,
    pathMatch: 'full'
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ScanRoutingModule { }
