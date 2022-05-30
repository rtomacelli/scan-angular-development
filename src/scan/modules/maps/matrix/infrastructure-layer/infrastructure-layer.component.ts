import { Component, Input, OnInit } from '@angular/core';

import { DialogService, DynamicDialogConfig } from 'primeng/api';

import { extend } from '@helpers/js.helper';
import { getDynamicDialogConfig } from '@helpers/ui.helper';
import { MAINFRAME_PROCESSING_TITLES } from '@models/mainframe';
import { LayerPanel, MatrixElement, MatrixGroup, MatrixPerspective, MatrixSubgroup, MATRIX_PATHS,
  ViewLayer } from '@models/reference-matrix';
import { ScanTreeNode } from '@models/ui';
import { AdabasDetailsComponent, BatchDetailsComponent, CicsDetailsComponent,
  ConfigurationDetailsComponent, Db2DetailsComponent } from '@modules/maps/details';
import { DiskStorageDialogComponent } from '@modules/maps/disk-storage';
import { HighEndDialogComponent } from '@modules/maps/high-end';
import { MainframeDialogComponent } from '@modules/maps/mainframe';
import { TapeLibraryDialogComponent } from '@modules/maps/tape-library';
import { MapService } from '@services/map.service';

@Component({
  selector: 'scan-infrastructure-layer',
  templateUrl: './infrastructure-layer.component.html',
  styleUrls: ['./infrastructure-layer.component.scss'],
  providers: [DialogService]
})
export class InfrastructureLayerComponent implements OnInit, LayerPanel {

  @Input() layer: ViewLayer;
  @Input() type: string;
  @Input() mapMode: string;
  @Input() mapComponentIds: number[];
  activeIndex = 1;
  perspectiveTrees: { [name: string]: ScanTreeNode[] } = {};

  views: string[] = ['Resumo', 'Perspectivas'];

  constructor(
    private mapService: MapService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.filteredPerspectives.forEach(perspective => {
      this.perspectiveTrees[perspective.nome] = this.getComponentTree(perspective);
    });
  }

  get filteredPerspectives(): MatrixPerspective[] {
    return (this.layer.content as MatrixPerspective[])
      .filter(perspective => !!perspective.listaGrupo && perspective.listaGrupo.length > 0);
  }

  getComponentTree(perspective: MatrixPerspective): ScanTreeNode[] {
    return this.groupsToTreeNodes(perspective.listaGrupo);
  }

  private groupsToTreeNodes(groups: MatrixGroup[]): ScanTreeNode[] {
    return groups ? groups.map(group => ({
      dataId: group.id,
      code: 'G',
      name: group.nome,
      data: group,
      styleClass: 'group',
      children: this.subgroupsToTreeNodes(group.listaSubGrupo)
    })) : null;
  }

  private subgroupsToTreeNodes(subgroups: MatrixSubgroup[]): ScanTreeNode[] {
    return subgroups ? subgroups.map(subgroup => ({
      dataId: subgroup.id,
      code: 'S',
      name: subgroup.nome,
      data: subgroup,
      styleClass: 'subgroup',
      children: this.elementsToTreeNodes(subgroup.listaElemento)
    })) : null;
  }

  private elementsToTreeNodes(elements: MatrixElement[]): ScanTreeNode[] {
    return elements ? elements.map(element => ({
      dataId: element.id,
      code: 'E',
      name: element.apelido || element.nome,
      title: (!!element.apelido && element.apelido !== element.nome) ? element.nome : '',
      data: element,
      styleClass: 'element',
      hasDetails: this.elementHasDetails(element)
    })) : null;
  }

  private elementHasDetails(element: MatrixElement): boolean {
    if (!!element && !!element.path) {
      return Object.values(MATRIX_PATHS).some(path => element.path.pathMatch(path));
    }
    return false;
  }

  nodeClick(data: MatrixGroup | MatrixSubgroup | MatrixElement) {
    if (!!data.path && !!data.path.element) {
      const element = data as MatrixElement;
      if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_NETWORK)) {
        this.openConfigurationDetails(element);
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_INTERFACE)) {
        this.openConfigurationDetails(element);
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_INTEGRATION)) {
        console.log('C2.P4');
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_MAINFRAME_BATCH, true)) {
        this.openBatchDetails();
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_MAINFRAME_CICS, true)) {
        this.openCicsDetails();
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_DATABASE_ADABAS, true)) {
        this.openAdabasDetails();
      } else if (element.path.pathMatch(MATRIX_PATHS.LOGICAL_DATABASE_DB2, true)) {
        this.openDB2Details();
      } else if (element.path.pathMatch(MATRIX_PATHS.PHYSICAL_MAINFRAME_BATCH, true)) {
        this.openMainframeDetails('batch');
      } else if (element.path.pathMatch(MATRIX_PATHS.PHYSICAL_MAINFRAME_CICS, true)) {
        this.openMainframeDetails('cics');
      } else if (element.path.pathMatch(MATRIX_PATHS.PHYSICAL_HIGH_END_X86, true)) {
        this.openHighEndDetails();
      } else if (element.path.pathMatch(MATRIX_PATHS.PHYSICAL_MAINFRAME_TAPELIBRARY, true)) {
        this.openTapeLibraryDetails();
      } else if (element.path.pathMatch(MATRIX_PATHS.PHYSICAL_MAINFRAME_DISK_SUBSYSTEM, true)) {
        this.openDiskSubsystemDetails();
      }
    }
  }

  private openConfigurationDetails(element: MatrixElement) {
    const config = extend<DynamicDialogConfig>({
      header: `Configuração – ${element.detailsHeader}`,
      data: { inInfrastructureMap: !!this.type, element: element }
    }, getDynamicDialogConfig());
    this.dialogService.open(ConfigurationDetailsComponent, config);
  }

  private openBatchDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Processamento – Online CICS Aplicação'
    }, getDynamicDialogConfig());
    this.dialogService.open(BatchDetailsComponent, config);
  }

  private openCicsDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Processamento – Online CICS Aplicação'
    }, getDynamicDialogConfig());
    this.dialogService.open(CicsDetailsComponent, config);
  }

  private openAdabasDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Armazenamento – Adabas'
    }, getDynamicDialogConfig());
    this.dialogService.open(AdabasDetailsComponent, config);
  }

  private openDB2Details() {
    const config = extend<DynamicDialogConfig>({
      header: 'Armazenamento – DB2'
    }, getDynamicDialogConfig());
    this.dialogService.open(Db2DetailsComponent, config);
  }

  private openMainframeDetails(processingType: string) {
    const config = extend<DynamicDialogConfig>({
      header: `Ambiente Mainframe – Processamento ${MAINFRAME_PROCESSING_TITLES[processingType]}`,
      data: { inInfrastructureMap: !!this.type, type: processingType }
    }, getDynamicDialogConfig());
    this.dialogService.open(MainframeDialogComponent, config);
  }

  private openHighEndDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Processamento – Ambiente Distribuído – x86',
      data: { inInfrastructureMap: !!this.type }
    }, getDynamicDialogConfig());
    this.dialogService.open(HighEndDialogComponent, config);
  }

  private openTapeLibraryDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Armazenamento – Fitoteca',
      data: { inInfrastructureMap: !!this.type }
    }, getDynamicDialogConfig());
    this.dialogService.open(TapeLibraryDialogComponent, config);
  }

  private openDiskSubsystemDetails() {
    const config = extend<DynamicDialogConfig>({
      header: 'Ambiente Mainframe – Subsistema de Discos',
      data: { inInfrastructureMap: !!this.type }
    }, getDynamicDialogConfig());
    this.dialogService.open(DiskStorageDialogComponent, config);
  }

  updateMapMode(mode: string) {
    this.mapService.setMapMode(mode);
  }

}
