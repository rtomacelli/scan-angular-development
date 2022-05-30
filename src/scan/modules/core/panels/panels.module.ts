import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrimeNGModule } from '@modules/core/prime-ng/prime-ng.module';

import * as panels from '.';

@NgModule({
  imports: [CommonModule, FormsModule, PrimeNGModule],
  declarations: [...panels.array],
  exports: [...panels.array]
})
export class PanelsModule {

}
