import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { MapsCommonModule } from '@modules/maps/common/maps-common.module';

import * as diskStorage from '@modules/maps/disk-storage';

@NgModule({
  imports: [ CommonModule, CoreModule, MapsCommonModule ],
  declarations: [ ...diskStorage.components ],
  exports: [ ...diskStorage.components ]
})
export class DiskStorageModule { }
