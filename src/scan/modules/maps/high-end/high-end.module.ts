import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';

import * as highEnd from '@modules/maps/high-end';

@NgModule({
  imports: [ CommonModule, CoreModule ],
  declarations: [ ...highEnd.components ],
  exports: [ ...highEnd.components ]
})
export class HighEndModule { }
