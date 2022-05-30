import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { MapsCommonModule } from '@modules/maps/common/maps-common.module';

import * as mapsDetails from '@modules/maps/details';

@NgModule({
  imports: [ CommonModule, CoreModule, MapsCommonModule ],
  declarations: [ ...mapsDetails.components ],
  exports: [ ...mapsDetails.components ]
})
export class MapsDetailsModule { }
