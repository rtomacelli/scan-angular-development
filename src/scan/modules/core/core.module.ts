import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrimeNGModule } from '@modules/core/prime-ng/prime-ng.module';
import { DirectivesModule } from './directives/directives.module';
import { PanelsModule } from './panels/panels.module';
import { PipesModule } from './pipes/pipes.module';
import { WidgetsModule } from './widgets/widgets.module';

const modules: any[] = [ DirectivesModule, PanelsModule, PipesModule,
  PrimeNGModule, WidgetsModule ];

@NgModule({
  imports: [ CommonModule, FormsModule, ...modules ],
  exports: [ FormsModule, ...modules ]
})
export class CoreModule { }
