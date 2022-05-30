import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { formatBytes } from '@helpers/js.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { App, AppPortfolio } from '@models/app-portfolio';
import { Metadata } from '@models/common';
import { DiskStorage, DiskStorageApplication, DiskStorageCluster, DiskStorageSubsystem } from '@models/disk-storage';
import { AppBarComponent } from '@modules/maps/common';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { AppRelationshipService } from '@services/app-relationship.service';
import { DiskStorageService } from '@services/disk-storage.service';
import { ReferenceDateService } from '@services/reference-date.service';

@Component({
  selector: 'scan-disk-storage',
  templateUrl: './disk-storage.component.html',
  styleUrls: ['./disk-storage.component.scss']
})
export class DiskStorageComponent implements OnInit, OnDestroy {

  @ViewChild('opApplication', { static: false }) opApplicationRef: OverlayPanel;
  @ViewChild('opStorage', { static: false }) opStorageRef: OverlayPanel;
  @ViewChild(AppBarComponent, { static: false }) appBarRef: AppBarComponent;
  @Input() config: DynamicDialogConfig;

  diskStorageSubsystem: DiskStorageSubsystem;
  appPortfolio: AppPortfolio;
  isDataLoaded: boolean;
  isDataValid = true;
  errorMessage: string;
  hoveredApplication: DiskStorageApplication;
  hoveredStorage: DiskStorage;
  hoveredApp: App;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private referenceDateService: ReferenceDateService,
    private diskStorageService: DiskStorageService,
    private appPortfolioService: AppPortfolioService,
    private appRelationshipService: AppRelationshipService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
    this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.hoveredApp = app));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get inDynamicDialog(): boolean {
    return !!this.config;
  }

  get inInfrastructureMap(): boolean {
    return this.inDynamicDialog && !!this.config.data.inInfrastructureMap;
  }

  get hoveredApplicationMetadata(): Metadata[] {
    if (this.hoveredApplication) {
      return [
        { key: 'Controladoras', values: [this.hoveredApplication.storages.length] },
        { key: 'Capacidade', values: [formatBytes(this.hoveredApplication.capacity, 'TB')] },
        {
          key: 'Sysplexes',
          values: this.hoveredApplication.sysplexes,
          class: 'color-coded-tag',
          paletteName: 'cluster',
          paletteKey: ''
        },
        { key: 'Siglas', values: [this.hoveredApplication.apps.length] }
      ];
    } else {
      return [];
    }
  }

  get hoveredStorageMetadata(): Metadata[] {
    if (this.hoveredStorage) {
      return [
        { key: 'Fabricante', values: [this.hoveredStorage.nomeFabricante] },
        { key: 'Modelo', values: [this.hoveredStorage.modelo] },
        { key: 'Endereço', values: [this.hoveredStorage.rangeMemoria] },
        { key: 'Capacidade', values: [formatBytes(this.hoveredStorage.capacidade, 'TB')] },
        { key: 'Referência', values: [this.hoveredStorage.dataReferencia] },
        {
          key: 'Sysplex',
          values: !!this.hoveredStorage.nomeCluster ? [this.hoveredStorage.nomeCluster] : ['—'],
          class: 'color-coded-tag',
          paletteName: 'cluster',
          paletteKey: !!this.hoveredStorage.nomeCluster ? this.hoveredStorage.nomeCluster : ''
        },
        {
          key: 'Aplicação',
          values: [this.hoveredStorage.codigoAplicacao],
          class: 'color-coded-tag',
          paletteName: 'application',
          paletteKey: this.hoveredStorage.codigoAplicacao
        },
        {
          key: 'Par',
          values: [this.hoveredStorage.pair ? this.hoveredStorage.pair.codigoSerial : ''],
          class: 'color-coded-tag',
          paletteName: 'application',
          paletteKey: this.hoveredStorage.codigoAplicacao
        },
        { key: 'Categoria', values: [this.hoveredStorage.category] },
        { key: 'Siglas', values: [this.hoveredStorage.listaSiglasArmazenadas.length] }
      ];
    } else {
      return [];
    }
  }

  private loadData() {
    this.isDataLoaded = false;

    this.subscriptions.add(forkJoin([
      this.diskStorageService.getDiskStorageSubsystem(),
      this.appPortfolioService.getAppPortfolio()
    ]).subscribe(([diskStorageSubsystem, appPortfolio]) => {
      this.diskStorageSubsystem = diskStorageSubsystem;
      this.appPortfolio = appPortfolio;
      this.isDataLoaded = true;
      this.isDataValid = this.checkData(diskStorageSubsystem, appPortfolio);
    }));
  }

  private checkData(diskStorageSubsystem: DiskStorageSubsystem, appPortfolio: AppPortfolio): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: appPortfolio.businessServices.length > 0,
      invalidMessage: 'Portfólio de Aplicativos incompleto'
    }, {
      isValid: !!appPortfolio.apps && appPortfolio.apps.length > 0,
      invalidMessage: 'siglas não encontradas'
    }, {
      isValid: diskStorageSubsystem.diskStorages.length > 0,
      invalidMessage: 'controladoras de disco não encontradas'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  storageHasApps(storage: DiskStorage): boolean {
    return storage
      && storage.listaSiglasArmazenadas
      && storage.listaSiglasArmazenadas.length > 0;
  }

  areStorageAppsAvailable(storage: DiskStorage): boolean {
    return !this.inInfrastructureMap && this.storageHasApps(storage);
  }

  // TODO Add conditional to test whether the app bar is editable
  showStorageApps(storage: DiskStorage) {
    if (!this.inInfrastructureMap && this.storageHasApps(storage)) {
      this.appBarRef.setAppsByCode(storage.listaSiglasArmazenadas);
    }
  }

  applicationHasApps(application: DiskStorageApplication): boolean {
    return !!application && !!application.apps && application.apps.length > 0;
  }

  areApplicationAppsAvailable(application: DiskStorageApplication): boolean {
    return !this.inInfrastructureMap && this.applicationHasApps(application);
  }

  showApplicationApps(application: DiskStorageApplication) {
    if (!this.inInfrastructureMap && this.applicationHasApps(application)) {
      this.appBarRef.setAppsByCode(application.apps);
    }
  }

  hoverApplication(application: DiskStorageApplication, $event: any) {
    this.hoveredApplication = application;
    this.opApplicationRef.show($event);
  }

  leaveApplication() {
    this.hoveredApplication = null;
    this.opApplicationRef.hide();
  }

  hoverStorage(storage: DiskStorage, $event: any) {
    this.hoveredStorage = storage;
    this.opStorageRef.show($event);
  }

  leaveStorage() {
    this.hoveredStorage = null;
    this.opStorageRef.hide();
  }

  isApplicationHighlighted(application: string): boolean {
    return (this.hoveredApplication && application === this.hoveredApplication.name)
      || (this.hoveredStorage && application === this.hoveredStorage.codigoAplicacao)
      || (this.hoveredApp
        && this.diskStorageSubsystem.diskStorages.some(storage => storage.codigoAplicacao === application
          && storage.listaSiglasArmazenadas.includes(this.hoveredApp.codigo)));
  }

  isStorageHighlighted(storage: DiskStorage): boolean {
    return (this.hoveredApplication && storage.codigoAplicacao === this.hoveredApplication.name)
      || (this.hoveredStorage && (this.isStorageHovered(storage) || this.isStoragePairHovered(storage)))
      || (this.hoveredApp && storage.listaSiglasArmazenadas.includes(this.hoveredApp.codigo));
  }

  private isStorageHovered(storage: DiskStorage): boolean {
    return this.isHoveredStorageInSameCluster(storage)
       && (storage === this.hoveredStorage || storage.codigoSerial === this.hoveredStorage.codigoSerial);
  }

  private isStoragePairHovered(storage: DiskStorage): boolean {
    return this.hoveredStorage.pair
      && this.hoveredStorage.pair.codigoSerial === storage.codigoSerial
      && this.isHoveredStorageInSameCluster(storage);
  }

  private isHoveredStorageInSameCluster(storage: DiskStorage) {
    if (storage.nomeCluster && this.hoveredStorage && this.hoveredStorage.nomeCluster) {
      return storage.nomeCluster === this.hoveredStorage.nomeCluster;
    } else if ((storage.nomeCluster && (!this.hoveredStorage && !this.hoveredStorage.nomeCluster))
      || (!storage.nomeCluster && (this.hoveredStorage && this.hoveredStorage.nomeCluster))) {
      return false;
    } else {
      return true;
    }
  }

  isSysplexHighlighted(sysplex: DiskStorageCluster): boolean {
    return (this.hoveredApplication && sysplex.applications.includes(this.hoveredApplication.name))
      || (this.hoveredStorage && this.isHoveredStorageInSysplex(sysplex))
      || (this.hoveredApp && sysplex.storages
        .some(storage => storage.listaSiglasArmazenadas.includes(this.hoveredApp.codigo)));
  }

  private isHoveredStorageInSysplex(sysplex: DiskStorageCluster): boolean {
    if (this.hoveredStorage.nomeCluster) {
      return sysplex.name === this.hoveredStorage.nomeCluster;
    } else {
      return sysplex.name === 'N/A';
    }
  }

  getHighlightedSysplexCapacity(sysplex: DiskStorageCluster): number {
    if (!!this.hoveredApplication) {
      return this.getSysplexCapacityByApplication(sysplex, this.hoveredApplication.name);
    } else if (!!this.hoveredStorage) {
      return this.getSysplexCapacityByStorage(sysplex, this.hoveredStorage);
    } else if (!!this.hoveredApp) {
      return this.getSysplexCapacityByApp(sysplex, this.hoveredApp);
    }
    return 0;
  }

  private getSysplexCapacityByApplication(sysplex: DiskStorageCluster, application: string): number {
    return sysplex.storages.filter(storage => storage.codigoAplicacao === application)
      .map(storage => storage.capacidade).reduce((sum, value) => sum + value, 0);
  }

  private getSysplexCapacityByStorage(sysplex: DiskStorageCluster, storage: DiskStorage): number {
    return sysplex.storages.filter(sysplexStorage => [storage.codigoSerial, storage.pair].includes(sysplexStorage.codigoSerial))
      .map(sysplexStorage => sysplexStorage.capacidade).reduce((sum, value) => sum + value, 0);
  }

  private getSysplexCapacityByApp(sysplex: DiskStorageCluster, app: App): number {
    return sysplex.storages.filter(storage => (storage.listaSiglasArmazenadas as string[]).includes(app.codigo))
      .map(storage => storage.capacidade).reduce((sum, value) => sum + value, 0);
  }

}
