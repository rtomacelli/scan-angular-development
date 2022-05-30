import { KeyValue } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { OverlayPanel } from 'primeng/overlaypanel';

import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { TapeLibrary, TapeLibraryApplication, TapeLibraryCartridgeCategory,
  TapeLibraryCluster, TapeLibrarySystem, TAPE_LIBRARY_SEGMENT_ORDER } from '@models/tape-library';
import { BarGraphCategory, BarGraphData, BarGraphSegment } from '@models/ui';
import { ReferenceDateService } from '@services/reference-date.service';
import { TapeLibraryService } from '@services/tape-library.service';

@Component({
  selector: 'scan-tape-library',
  templateUrl: './tape-library.component.html',
  styleUrls: ['./tape-library.component.scss']
})
export class TapeLibraryComponent implements OnInit, OnDestroy {

  @ViewChild('opLegend', { static: false }) opLegendRef: OverlayPanel;
  @Input() inDialog = false;

  tapeLibrarySystem: TapeLibrarySystem;
  isDataLoaded: boolean;
  isDataValid = false;
  errorMessage: string;
  currentView = 'capacidade';
  hoveredCategory: TapeLibraryCartridgeCategory;
  hoveredCluster: TapeLibraryCluster;
  hoveredApplication: TapeLibraryApplication;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private referenceDateService: ReferenceDateService,
    private tapeLibraryService: TapeLibraryService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get highlightKey(): string {
    if (!!this.hoveredCategory) {
      return this.hoveredCategory.nome;
    } else if (!!this.hoveredCluster) {
      return this.hoveredCluster.nome;
    } else if (!!this.hoveredApplication) {
      return this.hoveredApplication.nome;
    }
    return '';
  }

  get hoveredValue(): number {
    let value: number;
    if (!!this.hoveredCategory) {
      value = this.hoveredCategory[this.currentView];
    } else if (!!this.hoveredCluster) {
      value = this.hoveredCluster[this.currentView];
    } else if (!!this.hoveredApplication) {
      value = this.hoveredApplication[this.currentView];
    } else {
      value = 0;
    }
    return value;
  }

  get hoveredTotal(): number {
    let total: number;
    if (!!this.hoveredCategory) {
      total = this.tapeLibrarySystem.totals[this.currentView];
    } else if (!!this.hoveredCluster || !!this.hoveredApplication) {
      total = this.tapeLibrarySystem.used[this.currentView];
    } else {
      total = 0;
    }
    return total;
  }

  private loadData() {
    this.isDataLoaded = false;

    this.subscriptions.add(this.tapeLibraryService.getTapeLibrarySystem().subscribe(
      tapeLibrarySystem => {
        this.tapeLibrarySystem = tapeLibrarySystem;
        this.isDataLoaded = true;
        this.isDataValid = this.validateData(this.tapeLibrarySystem);
      }
    ));
  }

  private validateData(tapeLibrarySystem: TapeLibrarySystem): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!tapeLibrarySystem && !!tapeLibrarySystem.dataCenters && tapeLibrarySystem.dataCenters.length > 0
        && tapeLibrarySystem.dataCenters.some(dataCenter => !!dataCenter.listaFitoteca && dataCenter.listaFitoteca.length > 0),
      invalidMessage: 'fitotecas não encontradas'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  getTapeLibraryGraphData(tapeLibrary: TapeLibrary): BarGraphData {
    return new BarGraphData([
      new BarGraphSegment('Utilizados', [
        new BarGraphCategory('cartuchos', 'Cartuchos', tapeLibrary.qtdCartuchosDadosUso),
        new BarGraphCategory('capacidade', 'Capacidade Instalada', tapeLibrary.usedCapacity, 'bytes', 'GB'),
      ]),
      new BarGraphSegment('Fracionados', [
        new BarGraphCategory('cartuchos', 'Cartuchos', 0),
        new BarGraphCategory('capacidade', 'Capacidade Instalada', tapeLibrary.partialCapacity, 'bytes', 'GB'),
      ]),
      new BarGraphSegment('Limpeza', [
        new BarGraphCategory('cartuchos', 'Cartuchos', tapeLibrary.qtdCartuchosDadosLimpeza),
        new BarGraphCategory('capacidade', 'Capacidade Instalada', 0, 'bytes', 'GB'),
      ]),
      new BarGraphSegment('Livres', [
        new BarGraphCategory('cartuchos', 'Cartuchos', tapeLibrary.qtdCartuchosDadosLivres),
        new BarGraphCategory('capacidade', 'Capacidade Instalada', tapeLibrary.freeCapacity, 'bytes', 'GB'),
      ])
    ]);
  }

  getTapeLibraryClusterGraphData(tapeLibrary: TapeLibrary, clusterName: string): BarGraphData {
    const clusterApplicationData = tapeLibrary.listaDadosAplicacaoFitoteca
      .filter(data => data.origemCluster === clusterName);
    const segments: BarGraphSegment[] = clusterApplicationData.map(data => {
      return new BarGraphSegment(data.origemNomeAplicacao, [
        new BarGraphCategory('cartuchos', 'Cartuchos', data.qtdCartDados),
        new BarGraphCategory('capacidade', 'Capacidade Instalada', data.qtdDadosGb, 'bytes', 'GB')
      ]);
    });
    return new BarGraphData(segments);
  }

  legendSorter<T extends { nome: string }>(a: KeyValue<number, T>, b: KeyValue<number, T>): number {
    return TAPE_LIBRARY_SEGMENT_ORDER.indexOf(a.value.nome) - TAPE_LIBRARY_SEGMENT_ORDER.indexOf(b.value.nome);
  }

  hoverCategory(category: TapeLibraryCartridgeCategory, $event: any) {
    this.hoveredCategory = category;
    this.opLegendRef.show($event);
  }

  leaveCategory() {
    this.hoveredCategory = null;
    this.opLegendRef.hide();
  }

  hoverCluster(cluster: TapeLibraryCluster, $event: any) {
    this.hoveredCluster = cluster;
    this.opLegendRef.show($event);
  }

  leaveCluster() {
    this.hoveredCluster = null;
    this.opLegendRef.hide();
  }

  hoverApplication(application: TapeLibraryApplication, $event: any) {
    this.hoveredApplication = application;
    this.opLegendRef.show($event);
  }

  leaveApplication() {
    this.hoveredApplication = null;
    this.opLegendRef.hide();
  }

}
