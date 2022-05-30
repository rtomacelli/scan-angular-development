import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { textToIdentifier } from '@helpers/string.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { App, AppPortfolio, BusinessService } from '@models/app-portfolio';
import { MapCoordinates } from '@models/map-common';
import { MatrixElement, MatrixLayer, ReferenceMatrix, ViewLayer } from '@models/reference-matrix';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { AppRelationshipService } from '@services/app-relationship.service';
import { MapService } from '@services/map.service';
import { ReferenceDateService } from '@services/reference-date.service';
import { ReferenceMatrixService } from '@services/reference-matrix.service';

@Component({
  selector: 'scan-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit, OnDestroy {

  appPortfolio: AppPortfolio;
  referenceMatrix: ReferenceMatrix;

  mapApps: App[] = [];
  mapComponents: MapCoordinates = null;
  type: string;
  mapMode: string;
  mapModeSubscription: Subscription;
  key: string;
  target: MatrixElement | BusinessService | App;

  activeIndex = 0;
  isDataValid = true;
  errorMessage = '';
  layersLoaded: boolean;
  componentsLoaded: boolean;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private appPortfolioService: AppPortfolioService,
    private appRelationshipService: AppRelationshipService,
    private mapService: MapService,
    private referenceDateService: ReferenceDateService,
    private referenceMatrixService: ReferenceMatrixService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.appRelationshipService.clearHoveredApp();
    this.appRelationshipService.clearMapApps();
  }

  get isDataLoaded(): boolean {
    return this.layersLoaded && this.componentsLoaded;
  }

  get target$(): Observable<MatrixElement | BusinessService | App> {
    switch (this.type) {
      case 'interface': return this.referenceMatrixService.getInterface(this.key);
      case 'service': return this.appPortfolioService.getBusinessService(this.key);
      case 'app': return this.appPortfolioService.getApp(this.key);
      default: return of(null);
    }
  }

  get appBarEditable(): boolean {
    return !['interface', 'service', 'app'].includes(this.type);
  }

  get layers(): ViewLayer[] {
    return this.referenceMatrix.layers.map(layer => ({
      business: this.isBusinessLayer(layer),
      name: layer.nomeCamada,
      id: textToIdentifier(layer.nomeCamada),
      content: this.isBusinessLayer(layer)
        ? this.appPortfolio
        : layer.listaPerspectiva
    }));
  }

  get subject(): string {
    // const prefix = 'Mapa de';
    switch (this.type) {
      // case 'interface': return `${prefix} Interface`;
      // case 'service': return `${prefix} Assunto`;
      // case 'app': return `${prefix} Sigla`;
      case 'interface': return `Interface`;
      case 'service': return `Assunto`;
      case 'app': return `Sigla`;
      default: return `Mapa de Referência`;
    }
  }

  get mapComponentIds(): number[] {
    if (!!this.mapComponents) {
      return this.mapComponents.listaIdsComponentes;
    } else {
      return [];
    }
  }

  private loadData() {
    [this.layersLoaded, this.componentsLoaded] = [false, false];

    this.subscriptions.add(
      this.route.params.pipe(
        switchMap(params => {
          this.initializeMap(params);
          return this.target$;
        }),
        switchMap(target => {
          this.target = target;
          return forkJoin([this.loadLayers(), this.loadMapComponents(target, this.type)]);
        })
      ).subscribe(([layersLoaded, componentsLoaded]) => {
        [this.layersLoaded, this.componentsLoaded] = [layersLoaded, componentsLoaded];
        this.checkData(this.appPortfolio, this.referenceMatrix, this.type, this.mapComponents);
      })
    );
  }

  private initializeMap(params: Params) {
    this.type = params['type'];
    this.key = params['key'];
    this.activeIndex = !!this.type ? 1 : 0;
    const startingMode = !!this.type ? 'compact' : 'complete';
    this.subscriptions.add(this.mapService.getMapMode().subscribe(mode => this.mapMode = mode));
    this.mapService.setMapMode(startingMode);
  }

  private loadLayers(): Observable<boolean> {
    return forkJoin([
      this.appPortfolioService.getAppPortfolio(),
      this.referenceMatrixService.getReferenceMatrix()
    ]).pipe(
      map(([appPortfolio, referenceMatrix]) => {
        if (!!appPortfolio && !!referenceMatrix) {
          [this.appPortfolio, this.referenceMatrix] = [appPortfolio, referenceMatrix];
          return true;
        }
        return false;
      })
    );
  }

  private loadMapComponents(target: MatrixElement | BusinessService | App, type: string): Observable<boolean> {
    switch (type) {
      case 'interface': return this.loadInterfaceComponents(target as MatrixElement);
      case 'service': return this.loadServiceComponents(target as BusinessService);
      case 'app': return this.loadAppComponents(target as App);
      default: return this.clearMapComponents();
    }
  }

  private clearMapComponents(): Observable<boolean> {
    this.mapComponents = null;
    this.clearMapApps();
    return of(true);
  }

  private loadInterfaceComponents(interfaceElement: MatrixElement): Observable<boolean> {
    if (!!interfaceElement && !!interfaceElement.id) {
      return this.mapService.getInterfaceMapComponents(interfaceElement.id).pipe(
        switchMap(mapComponents => {
          if (!!mapComponents) {
            this.mapComponents = mapComponents;
            return this.loadMapApps(mapComponents.listaNomeSiglas);
          }
          return of(false);
        })
      );
    }
    return of(true);
  }

  private loadServiceComponents(service: BusinessService): Observable<boolean> {
    if (!!service && (!!service.siglasPrincipais || !!service.siglasSecundarias)) {
      const appCodes = (service.siglasPrincipais as string[]).concat(service.siglasSecundarias as string[]);
      return this.mapService.getAppsMapComponents(appCodes).pipe(
        switchMap(mapComponents => {
          if (!!mapComponents) {
            this.mapComponents = mapComponents;
            return this.loadMapApps(appCodes);
          }
          return of(false);
        })
      );
    }
    return of(true);
  }

  private loadAppComponents(app: App): Observable<boolean> {
    if (!!app) {
      return this.mapService.getAppsMapComponents([app.codigo]).pipe(
        switchMap(mapComponents => {
          if (!!mapComponents) {
            this.mapComponents = mapComponents;
            return this.loadMapApp(app);
          }
          return of(false);
        })
      );
    }
    return of(true);
  }

  private clearMapApps() {
    this.mapApps = [];
    this.appRelationshipService.clearMapApps();
    this.componentsLoaded = true;
  }

  private loadMapApps(appCodes: string[]): Observable<boolean> {
    return this.appPortfolioService.getApps(appCodes).pipe(
      map(apps => {
        if (!!apps) {
          this.mapApps = apps;
          this.appRelationshipService.setMapApps(this.mapApps);
          return true;
        }
        return false;
      })
    );
  }

  private loadMapApp(app: App): Observable<boolean> {
    if (!!app) {
      this.mapApps = [app];
      this.appRelationshipService.setMapApps(this.mapApps);
      return of(true);
    }
    return of(false);
  }

  private checkData(portfolio: AppPortfolio, matrix: ReferenceMatrix, type: string, mapComponents: MapCoordinates) {
    const conditions: ValidityCondition[] = [{
      isValid: portfolio.businessServices.length > 0,
      invalidMessage: 'assuntos de negócio não encontrados'
    }, {
      isValid: !!portfolio.apps && portfolio.apps.length > 0,
      invalidMessage: 'siglas não encontradas'
    }, {
      isValid: matrix.elements.length > 0,
      invalidMessage: 'elementos da Matriz não encontrados'
    }, {
      isValid: !type || (!!mapComponents && !!mapComponents.listaNomeSiglas && !!mapComponents.listaIdsComponentes),
      invalidMessage: 'componentes do mapa não encontrados'
    }];

    this.errorMessage = validateData(conditions);
    this.isDataValid = this.errorMessage.length === 0;
  }

  private isBusinessLayer(layer: MatrixLayer): boolean {
    return layer.nomeCamada === 'Negócio';
  }

  layerId({id}: ViewLayer) {
    return id;
  }

}
