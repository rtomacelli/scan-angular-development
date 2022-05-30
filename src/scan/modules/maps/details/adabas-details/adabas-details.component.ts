import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';

import { AdabasService } from '@services/adabas.service';
import { AppRelationshipService } from '@services/app-relationship.service';
import { switchMap, map } from 'rxjs/operators';
import { AdabasRecord } from '@models/adabas/adabas-record.model';
import { ValidityCondition, validateData } from '@helpers/validation.helper';

@Component({
  selector: 'scan-adabas-details',
  templateUrl: './adabas-details.component.html',
  styleUrls: ['./adabas-details.component.scss']
})
export class AdabasDetailsComponent implements OnInit, OnDestroy {

  adabasRecords: AdabasRecord[];
  isDataLoaded = false;
  isDataValid = true;
  errorMessage = '';
  private subscription: Subscription;

  readonly pageSizeValues = [10, 20, 30, 40, 50, null];
  readonly columns: { field: string, header: string }[] = [
    { field: 'numeroDbid', header: 'DBID' },
    { field: 'origemSigla', header: 'Sigla' },
    { field: 'origemCluster', header: 'Sysplex' }
  ];
  readonly fields = this.columns.map(column => column.field);

  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  currentPage = 1;

  constructor(
    private appRelationshipService: AppRelationshipService,
    private adabasService: AdabasService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get recordsOnCurrentPage(): number {
    const quotient = this.adabasRecords.length / (this.rowsPerPage * this.currentPage);
    if (quotient >= 1) {
      return this.rowsPerPage;
    } else {
      return this.adabasRecords.length % this.rowsPerPage;
    }
  }

  private loadData() {
    this.subscription = this.appRelationshipService.getMapApps().pipe(
      map(apps => apps.map(app => app.codigo)),
      switchMap(appCodes => this.adabasService.getAdabasDetails(appCodes))
    ).subscribe(
      adabasRecords => {
        this.adabasRecords = adabasRecords;
        this.isDataValid = this.checkData(adabasRecords);
        if (this.isDataValid) { this.buildPageSizeItems(); }
        this.isDataLoaded = true;
      }
    );
  }

  private checkData(adabasRecords: AdabasRecord[]): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!adabasRecords && adabasRecords.hasOwnProperty('length'),
      invalidMessage: 'dados inválidos'
    }];
    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(size => ({
      label: size ? size.toString() : 'Todos',
      value: size ? size : this.adabasRecords.length
    }));
  }

}
