import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';

import { PreferencesComponent } from '@modules/settings/preferences/preferences.component';

@NgModule({
  imports: [ CommonModule, CoreModule ],
  declarations: [ PreferencesComponent ],
  exports: [ PreferencesComponent ]
})
export class PreferencesModule { }
