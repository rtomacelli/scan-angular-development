import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PickListModule } from 'primeng/picklist';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';

const primeNgModules: any[] = [ ButtonModule, CalendarModule, DialogModule,
  DropdownModule, DynamicDialogModule, InputTextModule, MenuModule,
  MultiSelectModule, OverlayPanelModule, PickListModule, TabViewModule,
  TableModule, ToolbarModule, TreeModule ];

@NgModule({
  imports: [...primeNgModules],
  exports: [...primeNgModules]
})
export class PrimeNGModule { }
