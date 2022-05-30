import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@modules/core/core.module';
import { PreferencesModule } from '@modules/settings/preferences/preferences.module';
import { SettingsRoutingModule } from '@modules/settings/settings-routing.module';

import { SettingsComponent } from '@modules/settings/settings.component';

@NgModule({
  imports: [ CommonModule, CoreModule, PreferencesModule, SettingsRoutingModule ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule { }
