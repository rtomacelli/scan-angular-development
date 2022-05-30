import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { ROUTES } from '@routes/local.routes';
import { AdminComponent, DepartmentsComponent, FeaturesComponent, JobsComponent, ProfilesComponent, UsersComponent } from '.';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', canActivateChild: [AuthGuard], children: [
      { path: ROUTES.settings.children.admin.children.features.path, component: FeaturesComponent },
      { path: ROUTES.settings.children.admin.children.profiles.path, component: ProfilesComponent },
      { path: ROUTES.settings.children.admin.children.users.path, component: UsersComponent },
      { path: ROUTES.settings.children.admin.children.departments.path, component: DepartmentsComponent },
      { path: ROUTES.settings.children.admin.children.jobs.path, component: JobsComponent },
      { path: '', redirectTo: ROUTES.settings.children.admin.children.features.path, pathMatch: 'full' }
    ] },
  ] }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule { }
