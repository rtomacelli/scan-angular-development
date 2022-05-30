import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

import { DynamicDialogConfig, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { OverlayPanel } from 'primeng/overlaypanel';

import { capitalizeWord } from '@helpers/string.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { App, AppPortfolio } from '@models/app-portfolio';
import { Metadata } from '@models/common';
import { MAINFRAME_PROCESSING_TITLES, MainframeEnvironment, MainframeLpar } from '@models/mainframe';
import { AppBarComponent } from '@modules/maps/common';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { AppRelationshipService } from '@services/app-relationship.service';
import { MainframeService } from '@services/mainframe.service';
import { ReferenceDateService } from '@services/reference-date.service';

@Component({
  selector: 'scan-mainframe',
  templateUrl: './mainframe.component.html',
  styleUrls: ['./mainframe.component.scss']
})
export class MainframeComponent implements OnInit, OnDestroy {

  @ViewChild('lparMenu', { static: false }) lparMenuRef: Menu;
  @ViewChild('opLpar', { static: false }) opLparRef: OverlayPanel;
  @ViewChild(AppBarComponent, { static: false }) appBarRef: AppBarComponent;
  @Input() config: DynamicDialogConfig;

  appBarEditable = true; // TODO Make this dynamic for maps
  hoveredApp: App;

  mainframeEnvironment: MainframeEnvironment;
  appPortfolio: AppPortfolio;
  isDataLoaded: boolean;
  isDataValid = true;
  errorMessage: string;

  type: string;
  processingTitle = MAINFRAME_PROCESSING_TITLES;

  hoveredLpar: MainframeLpar;
  clickedLpar: MainframeLpar;
  showReportClasses = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private referenceDateService: ReferenceDateService,
    private mainframeService: MainframeService,
    private appPortfolioService: AppPortfolioService,
    private appRelationshipService: AppRelationshipService
  ) { }

  ngOnInit() {
    if (this.inDynamicDialog) {
      this.initialize(this.config.data.type);
    } else {
      this.route.params.subscribe(params => this.initialize(params['type']));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initialize(type: string) {
    this.type = type;
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
    this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.hoveredApp = app));
  }

  get inDynamicDialog(): boolean {
    return !!this.config;
  }

  get inInfrastructureMap(): boolean {
    return this.inDynamicDialog && !!this.config.data.inInfrastructureMap;
  }

  get lparMenuItems(): MenuItem[] {
    return [{
      label: 'Siglas processadas',
      icon: 'fa fa-fw fa-cogs',
      command: () => this.showLparApps(this.clickedLpar),
      disabled: this.inInfrastructureMap
    }, {
      label: 'Classes de relatório',
      icon: 'fa fa-fw fa-file-text-o',
      command: () => this.showLparReportClasses(this.clickedLpar)
    }];
  }

  get hoveredLparMetadata(): Metadata[] {
    if (this.hoveredLpar) {
      let metadata: Metadata[] = [{
        key: 'Cluster',
        values: [this.hoveredLpar.imagem.nomeCluster],
        class: 'color-coded-tag',
        paletteName: 'cluster',
        paletteKey: this.hoveredLpar.imagem.nomeCluster
      }];
      if (this.hoveredLpar.imagem.sistemaOperacional === 'z/OS') {
        metadata = metadata.concat([{
          key: `Siglas com processamento ${this.processingTitle[this.type]}`,
          values: [this.getLparAppCodes(this.hoveredLpar).length]
        }, {
          key: 'Classes de relatório',
          values: [this.hoveredLpar.imagem.classesRelatorio.length]
        }]);
      }
      return metadata;
    } else {
      return [];
    }
  }

  private loadData() {
    this.isDataLoaded = false;

    forkJoin([
      this.mainframeService.getMainframeEnvironment(),
      this.appPortfolioService.getAppPortfolio()
    ]).subscribe(([newMainframeEnvironment, appPortfolio]) => {
      this.mainframeEnvironment = newMainframeEnvironment;
      this.appPortfolio = appPortfolio;
      this.isDataLoaded = true;
      this.isDataValid = this.checkData(this.mainframeEnvironment, this.appPortfolio);
    });
  }

  private checkData(mainframeEnvironment: MainframeEnvironment, appPortfolio: AppPortfolio): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!appPortfolio && !!appPortfolio.apps && appPortfolio.apps.length > 0,
      invalidMessage: 'siglas não encontradas'
    }, {
      isValid: !!mainframeEnvironment && mainframeEnvironment.hasDataCenters && mainframeEnvironment.hasLpars,
      invalidMessage: 'topologia do ambiente mainframe incompleta'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  hoverLpar(lpar: MainframeLpar, $event: any) {
    if (!this.showReportClasses && !!lpar.imagem.nome) {
      this.hoveredLpar = lpar;
      this.lparMenuRef.hide();
      this.opLparRef.hide();
      if (lpar.imagem.id !== 0) {
        this.opLparRef.show($event);
      }
    }
  }

  leaveLpar() {
    this.hoveredLpar = null;
    this.opLparRef.hide();
  }

  getLparAppCodes(lpar: MainframeLpar): string[] {
    const appCodesByType = `siglas${capitalizeWord(this.type)}`;
    const appCodes = (lpar.imagem[appCodesByType] as string[]);
    return appCodes || [];
  }

  isLparClicked(lpar: MainframeLpar): boolean {
    return lpar === this.clickedLpar;
  }

  isLparMenuAvailable(lpar: MainframeLpar): boolean {
    return lpar && lpar.imagem && lpar.imagem.sistemaOperacional === 'z/OS'
      && (this.getLparAppCodes(lpar).length > 0
        || lpar.imagem.classesRelatorio.length > 0);
  }

  showLparMenu(lpar: MainframeLpar, $event: any) {
    if (!this.showReportClasses && this.isLparMenuAvailable(lpar)) {
      this.clickedLpar = lpar;
      this.opLparRef.hide();
      this.lparMenuRef.toggle($event);
    }
  }

  private showLparApps(lpar: MainframeLpar) {
    const appList = this.getLparAppCodes(lpar);
    if (appList && Array.isArray(appList) && appList.length > 0) {
      this.appBarRef.setAppsByCode(appList);
    }
  }

  private showLparReportClasses(lpar: MainframeLpar) {
    if (lpar.imagem.classesRelatorio && lpar.imagem.classesRelatorio.length > 0) {
      this.showReportClasses = true;
    }
  }

  clearClickedLpar() {
    this.clickedLpar = null;
  }

}
