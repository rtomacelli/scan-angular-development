import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';

import * as mapsCommon from '@modules/maps/common';

@NgModule({
  imports: [ CommonModule, CoreModule ],
  declarations: [ ...mapsCommon.components ],
  exports: [ CommonModule, ...mapsCommon.components ]
})
export class MapsCommonModule { }
