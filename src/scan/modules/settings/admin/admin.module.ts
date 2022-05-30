import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { AdminRoutingModule } from '@modules/settings/admin/admin-routing.module';

import * as admin from '@modules/settings/admin';

@NgModule({
  imports: [ AdminRoutingModule, CommonModule, CoreModule ],
  declarations: [ ...admin.components ]
})
export class AdminModule { }
