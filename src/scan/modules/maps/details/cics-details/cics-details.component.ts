import { Component, OnInit, OnDestroy } from '@angular/core';
import { CicsRecord } from '@models/cics/cics-record.model';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { AppRelationshipService } from '@services/app-relationship.service';
import { CicsService } from '@services/cics.service';
import { map, switchMap } from 'rxjs/operators';
import { ValidityCondition, validateData } from '@helpers/validation.helper';

@Component({
  selector: 'scan-cics-details',
  templateUrl: './cics-details.component.html',
  styleUrls: ['./cics-details.component.scss']
})
export class CicsDetailsComponent implements OnInit, OnDestroy {

  cicsRecords: CicsRecord[];
  isDataLoaded = false;
  isDataValid = true;
  errorMessage = '';
  private subscription: Subscription;

  readonly pageSizeValues = [10, 20, 30, 40, 50, null];
  readonly columns: { field: string, header: string }[] = [
    { field: 'nome', header: 'CICS' },
    { field: 'dataMovimento', header: 'Movimento' },
    { field: 'nomeImagem', header: 'Sysplex/Imagem' },
    { field: 'listaCodigoSigla', header: 'Siglas' }
  ];
  readonly fields = this.columns.map(column => column.field);

  pageSizes: SelectItem[] = [];
  rowsPerPage = this.pageSizeValues[0];
  currentPage = 1;

  constructor(
    private appRelationshipService: AppRelationshipService,
    private cicsService: CicsService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get recordsOnCurrentPage(): number {
    const quotient = this.cicsRecords.length / (this.rowsPerPage * this.currentPage);
    if (quotient >= 1) {
      return this.rowsPerPage;
    } else {
      return this.cicsRecords.length % this.rowsPerPage;
    }
  }

  private loadData() {
    this.subscription = this.appRelationshipService.getMapApps().pipe(
      map(apps => apps.map(app => app.codigo)),
      switchMap(appCodes => this.cicsService.getCicsDetails(appCodes))
    ).subscribe(
      cicsRecords => {
        this.cicsRecords = cicsRecords;
        this.isDataValid = this.checkData(cicsRecords);
        if (this.isDataValid) { this.buildPageSizeItems(); }
        this.isDataLoaded = true;
      }
    );
  }

  private checkData(cicsRecords: CicsRecord[]): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!cicsRecords && cicsRecords.hasOwnProperty('length'),
      invalidMessage: 'dados inválidos'
    }];
    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(size => ({
      label: size ? size.toString() : 'Todos',
      value: size ? size : this.cicsRecords.length
    }));
  }

}
