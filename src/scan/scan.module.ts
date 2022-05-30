import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@modules/core/core.module';
import { SearchModule } from '@modules/search/search.module';
import { ScanRoutingModule } from 'scan/scan-routing.module';

import { ScanComponent } from 'scan/scan.component';

@NgModule({
  imports: [ BrowserAnimationsModule, BrowserModule, CoreModule, HttpClientModule, ScanRoutingModule, SearchModule ],
  declarations: [ ScanComponent ],
  bootstrap: [ ScanComponent ]
})
export class ScanModule { }
