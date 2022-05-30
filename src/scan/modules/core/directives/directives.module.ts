import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as directives from '.';

@NgModule({
  imports: [CommonModule],
  declarations: [...directives.array],
  exports: [...directives.array]
})
export class DirectivesModule { }
