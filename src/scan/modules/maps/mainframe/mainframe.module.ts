import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { MapsCommonModule } from '@modules/maps/common/maps-common.module';

import * as mainframe from '@modules/maps/mainframe';

@NgModule({
  imports: [ CommonModule, CoreModule, MapsCommonModule ],
  declarations: [ ...mainframe.components ],
  exports: [ CommonModule, ...mainframe.components ]
})
export class MainframeModule { }
