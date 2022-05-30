import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';

import { DB2Record } from '@models/db2/db2-record.model';
import { DB2Service } from '@services/db2.service';
import { AppRelationshipService } from '@services/app-relationship.service';
import { map, switchMap } from 'rxjs/operators';
import { ValidityCondition, validateData } from '@helpers/validation.helper';

@Component({
  selector: 'scan-db2-details',
  templateUrl: './db2-details.component.html',
  styleUrls: ['./db2-details.component.scss']
})
export class Db2DetailsComponent implements OnInit, OnDestroy {

  db2Records: DB2Record[];
  isDataLoaded = false;
  isDataValid = true;
  errorMessage = '';
  private subscription: Subscription;

  readonly pageSizeValues = [10, 20, 30, 40, 50, null];
  readonly columns: { field: string, header: string }[] = [
    { field: 'bind', header: 'Bind' },
    { field: 'origemSigla', header: 'Sigla' },
    { field: 'siloNegocio1', header: 'Silo de Negócio #1' },
    { field: 'siloNegocio2', header: 'Silo de Negócio #2' },
    { field: 'dataSharing', header: 'Data Sharing' },
  ];
  readonly fields = this.columns.map(column => column.field);

  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  currentPage = 1;

  constructor(
    private appRelationshipService: AppRelationshipService,
    private db2Service: DB2Service
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get recordsOnCurrentPage(): number {
    const quotient = this.db2Records.length / (this.rowsPerPage * this.currentPage);
    if (quotient >= 1) {
      return this.rowsPerPage;
    } else {
      return this.db2Records.length % this.rowsPerPage;
    }
  }

  private loadData() {
    this.subscription = this.appRelationshipService.getMapApps().pipe(
      map(apps => apps.map(app => app.codigo)),
      switchMap(appCodes => this.db2Service.getDB2Details(appCodes))
    ).subscribe(
      db2Records => {
        this.db2Records = db2Records;
        this.isDataValid = this.checkData(db2Records);
        if (this.isDataValid) { this.buildPageSizeItems(); }
        this.isDataLoaded = true;
      }
    );
  }

  private checkData(db2Records: DB2Record[]): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!db2Records && db2Records.hasOwnProperty('length'),
      invalidMessage: 'dados inválidos'
    }];
    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(size => ({
      label: size ? size.toString() : 'Todos',
      value: size ? size : this.db2Records.length
    }));
  }

}
