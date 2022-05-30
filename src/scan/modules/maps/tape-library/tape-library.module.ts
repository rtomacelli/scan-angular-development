import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';

import * as tapeLibrary from '@modules/maps/tape-library';

@NgModule({
  imports: [ CommonModule, CoreModule ],
  declarations: [ ...tapeLibrary.components ],
  exports: [ ...tapeLibrary.components ]
})
export class TapeLibraryModule { }
