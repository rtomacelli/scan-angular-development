import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SelectItem } from 'primeng/api';

import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { BatchRecord } from '@models/batch/batch-record.model';
import { AppRelationshipService } from '@services/app-relationship.service';
import { BatchService } from '@services/batch.service';

@Component({
  selector: 'scan-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent implements OnInit, OnDestroy {

  batchRecords: BatchRecord[];
  isDataLoaded = false;
  isDataValid = true;
  errorMessage = '';
  private subscription: Subscription;

  readonly pageSizeValues = [10, 20, 30, 40, 50, null];
  readonly columns: { field: string, header: string }[] = [
    { field: 'nomeJob', header: 'Job' },
    { field: 'nomeSigla', header: 'Sigla' },
    { field: 'codigoSilo', header: 'Silo' },
    { field: 'nomeCentroProducao', header: 'Centro de Produção' },
    { field: 'qtdExecucoes', header: 'Execuções' },
    { field: 'qtdAbendados', header: 'ABENDs' },
    { field: 'qtdTempoCpu', header: 'Tempo de CPU' },
    { field: 'qtdTempoSala', header: 'Tempo de Sala' }
  ];
  readonly fields = this.columns.map(column => column.field);

  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  currentPage = 1;

  constructor(
    private appRelationshipService: AppRelationshipService,
    private batchService: BatchService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get recordsOnCurrentPage(): number {
    const quotient = this.batchRecords.length / (this.rowsPerPage * this.currentPage);
    if (quotient >= 1) {
      return this.rowsPerPage;
    } else {
      return this.batchRecords.length % this.rowsPerPage;
    }
  }

  private loadData() {
    this.subscription = this.appRelationshipService.getMapApps().pipe(
      map(apps => apps.map(app => app.codigo)),
      switchMap(appCodes => this.batchService.getBatchDetails(appCodes))
    ).subscribe(
      cicsRecords => {
        this.batchRecords = cicsRecords;
        this.isDataValid = this.checkData(cicsRecords);
        if (this.isDataValid) { this.buildPageSizeItems(); }
        this.isDataLoaded = true;
      }
    );
  }

  private checkData(batchRecords: BatchRecord[]): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!batchRecords && batchRecords.hasOwnProperty('length'),
      invalidMessage: 'dados inválidos'
    }];
    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(size => ({
      label: size ? size.toString() : 'Todos',
      value: size ? size : this.batchRecords.length
    }));
  }

}
