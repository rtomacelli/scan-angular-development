import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import * as pipes from '.';

@NgModule({
  imports: [CommonModule],
  declarations: [...pipes.array],
  exports: [...pipes.array]
})
export class PipesModule { }
