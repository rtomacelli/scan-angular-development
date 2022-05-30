import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { SelectItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';

import { clone, toISODateString } from '@helpers/js.helper';
import { Feature } from '@models/admin';
import { NOW, PRIME_LOCALE_PT } from '@models/common';
import { AdministrationService } from '@services/administration.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'scan-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  @ViewChildren('filter') filters: QueryList<ElementRef | Calendar | MultiSelect>;

  features: Feature[];
  dataIsLoaded = false;

  clonedFeatures: { [id: number]: Feature } = {};

  readonly today = new Date;
  readonly primeLocalePt = PRIME_LOCALE_PT;
  readonly columns = [
    { field: 'ativo', header: 'Status' },
    { field: 'rota', header: 'Rota' },
    { field: 'nome', header: 'Nome' },
    { field: 'descricao', header: 'Descrição' },
    { field: 'dataCadastro', header: 'Cadastro' },
    { field: 'usuarioAlterador', header: 'Alterada Por' },
    { field: 'podeSerAlterado', header: 'Editar' }
  ];
  readonly fields = this.columns.map(column => column.field);
  readonly pageSizeValues = [6, 12, 18, 24, 30, 36, null];

  pageSizes: SelectItem[] = [];
  statuses: SelectItem[] = [{ label: 'Ativa', value: 'S' }, { label: 'Inativa', value: 'N' }];
  editOptions: SelectItem[] = [{ label: 'Editável', value: 'S' }, { label: 'Não Editável', value: 'N' }];
  rowsPerPage = this.pageSizeValues[0];
  dateFilter: Date;
  minimumDate: Date;

  constructor(
    private administrationService: AdministrationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.administrationService.getFeatures().subscribe(features => {
      this.features = features;
      this.buildPageSizeItems();
      this.findMinimumDate();
      this.dataIsLoaded = true;
    });
  }

  private buildPageSizeItems() {
    this.pageSizes = this.pageSizeValues.map(value => ({
      label: value ? value.toString() : 'Todas',
      value: value ? value : this.features.length
    }));
  }

  private findMinimumDate() {
    this.minimumDate = this.features
      .map(feature => feature.dataCadastro.toDate())
      .sort((a, b) => a.getTime() - b.getTime())[0];
  }

  formattedFeatureRoute(route: string): string {
    return route
      .replace(/(\/)/g, '$1<wbr>')
      .replace(/([a-z])([A-Z])/g, '$1<wbr>$2');
  }

  onRowEditInit(feature: Feature) {
    this.clonedFeatures[feature.id] = clone(feature);
  }

  onRowEditSave(feature: Feature, index: number) {
    if (feature.nome.length > 0) {
      this.authenticationService.getUser().subscribe(user => {
        feature.matriculaAlterador = user.uid;
        feature.nomeAlterador = user.name;
        feature.dataUltimaAlteracao = NOW();

        this.administrationService.saveFeature(feature).subscribe(success => {
          if (success) {
            this.features[index] = clone(feature);
          } else {
            this.features[index] = this.clonedFeatures[feature.id];
            alert(`Não foi possível salvar a funcionalidade "${feature.nome}".`);
          }
          delete this.clonedFeatures[feature.id];
        });
      });
    } else {
      alert('A funcionalidade precisa ter um nome.');
    }
  }

  onRowEditCancel(feature: Feature, index: number) {
    this.features[index] = this.clonedFeatures[feature.id];
    delete this.clonedFeatures[feature.id];
  }

  onCalendarClose(featuresTable: Table) {
    const value = !!this.dateFilter ? toISODateString(this.dateFilter) : '';
    featuresTable.filter(value, 'dataCadastro', 'contains');
  }

  onResetTable($event: any, featuresTable: Table) {
    this.filters.forEach(filter => {
      if (filter instanceof Calendar) {
        filter.onClearButtonClick($event);
      } else if (filter instanceof MultiSelect) {
        filter.value = null;
        filter.updateLabel();
      } else {
        filter.nativeElement.value = '';
      }
    });
    featuresTable.reset();
  }

}
