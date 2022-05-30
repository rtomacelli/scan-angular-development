import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DirectivesModule } from '@modules/core/directives/directives.module';
import { PipesModule } from '@modules/core/pipes/pipes.module';
import { PrimeNGModule } from '@modules/core/prime-ng/prime-ng.module';

import * as widgets from '.';

@NgModule({
  imports: [ CommonModule, FormsModule, DirectivesModule, PipesModule, PrimeNGModule ],
  declarations: [ ...widgets.components ],
  exports: [ ...widgets.components ]
})
export class WidgetsModule { }
