import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { isNumeric } from '@helpers/js.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { Metadata } from '@models/common';
import { ConfigurationDetails, ConfigurationItemTypes, CONFIGURATION_ITEM_TYPE_DESCRIPTORS } from '@models/configuration-details';
import { MatrixElement, MATRIX_PATHS } from '@models/reference-matrix';
import { ConfigurationDetailsService } from '@services/configuration-details.service';
import { ReferenceDateService } from '@services/reference-date.service';

@Component({
  selector: 'scan-configuration-details',
  templateUrl: './configuration-details.component.html',
  styleUrls: ['./configuration-details.component.scss']
})
export class ConfigurationDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('opItem', { static: false }) opItemRef: OverlayPanel;

  element: MatrixElement;
  details: ConfigurationDetails;
  typeDescriptors = CONFIGURATION_ITEM_TYPE_DESCRIPTORS;
  isDataLoaded: boolean;
  isDataValid = true;
  errorMessage = '';
  private subscriptions: Subscription = new Subscription();

  hoveredItem: KeyValue<string, string>;

  constructor(
    private referenceDateService: ReferenceDateService,
    private configurationDetailsService: ConfigurationDetailsService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.element = this.config.data.element;
    if (!!this.element) {
      this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadData() {
    this.isDataLoaded = false;
    if (this.element.path.pathMatch(MATRIX_PATHS.LOGICAL_NETWORK)) {
      this.configurationDetailsService.getLogicalNetworkDetails(this.element.id).subscribe(details => this.saveDetails(details));
    } else if (this.element.path.pathMatch(MATRIX_PATHS.LOGICAL_INTERFACE)) {
      this.configurationDetailsService.getLogicalInterfaceDetails(this.element.id).subscribe(details => this.saveDetails(details));
    }
  }

  private saveDetails(details: ConfigurationDetails) {
    this.details = details;
    this.isDataLoaded = true;
    this.isDataValid = this.checkData(details);
  }

  private checkData(details: ConfigurationDetails): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!details && Object.keys(details).length > 0,
      invalidMessage: 'detalhamento não encontrado'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  hoverItem(item: KeyValue<string, string>, $event: any) {
    this.hoveredItem = item;
    this.opItemRef.show($event);
  }

  leaveItem() {
    this.hoveredItem = null;
    this.opItemRef.hide();
  }

  get hoveredItemMetadata(): Metadata[] {
    if (!!this.hoveredItem) {
      return [
        { key: 'ID', values: [this.hoveredItem.key] },
        { key: 'Nome', values: [this.hoveredItem.value] }
      ];
    } else {
      return [];
    }
  }

  get itemsAvailable(): boolean {
    return !!this.details && Object.values(this.details).some(details => Object.keys(details).length > 0);
  }

  isItemTypeEmpty(type: ConfigurationItemTypes): boolean {
    return (!this.details || !this.details[type] || Object.values(this.details[type]).length === 0);
  }

  itemSorter(a: KeyValue<string, string>, b: KeyValue<string, string>): number {
    if (isNumeric(a.value) && isNumeric(b.value)) {
      return parseFloat(a.value) - parseFloat(b.value);
    } else {
      return a.value.localeCompare(b.value);
    }
  }

}
