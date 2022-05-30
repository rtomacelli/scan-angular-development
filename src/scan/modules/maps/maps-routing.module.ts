import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { DiskStorageComponent } from '@modules/maps/disk-storage';
import { HighEndComponent } from '@modules/maps/high-end';
import { MainframeComponent } from '@modules/maps/mainframe';
import { MatrixComponent } from '@modules/maps/matrix';
import { TapeLibraryComponent } from '@modules/maps/tape-library';
import { ROUTES } from '@routes/local.routes';

const routes: Routes = [
  { path: '', component: MatrixComponent },
  { path: ROUTES.map.children.diskStorage.path, component: DiskStorageComponent, canActivate: [AuthGuard] },
  { path: `${ROUTES.map.children.mainframe.path}/:type`, component: MainframeComponent, canActivate: [AuthGuard] },
  { path: ROUTES.map.children.highEnd.path, component: HighEndComponent, canActivate: [AuthGuard] },
  { path: ROUTES.map.children.tapeLibrary.path, component: TapeLibraryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
