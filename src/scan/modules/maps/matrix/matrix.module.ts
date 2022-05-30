import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InlineSVGModule } from 'ng-inline-svg';

import { CoreModule } from '@modules/core/core.module';
import { MapsCommonModule } from '@modules/maps/common/maps-common.module';

import * as matrix from '@modules/maps/matrix';

@NgModule({
  imports: [ CommonModule, CoreModule, InlineSVGModule.forRoot(), MapsCommonModule ],
  declarations: [ ...matrix.components ],
  exports: [ ...matrix.components ]
})
export class MatrixModule { }
