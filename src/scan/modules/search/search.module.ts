import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';

import * as search from '@modules/search';

@NgModule({
  imports: [ CommonModule, CoreModule ],
  declarations: [ ...search.components ],
  exports: [ ...search.components ]
})
export class SearchModule { }
