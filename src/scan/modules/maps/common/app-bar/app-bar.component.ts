import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DialogService, DynamicDialogConfig, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { OverlayPanel } from 'primeng/overlaypanel';

import { extend } from '@helpers/js.helper';
import { getDynamicDialogConfig } from '@helpers/ui.helper';
import { App, AppPortfolio, PortfolioPath } from '@models/app-portfolio';
import { ScanTreeNode } from '@models/ui';
import { TreeComponent } from '@modules/core/widgets';
import { AppDetailsComponent } from '@modules/maps/details';
import { AppRelationshipService } from '@services/app-relationship.service';

@Component({
  selector: 'scan-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
  providers: [DialogService]
})
export class AppBarComponent implements OnInit, OnDestroy {

  @Input() appPortfolio: AppPortfolio;
  @Input() apps: App[] = [];
  @Input() editable = true;

  @ViewChild(TreeComponent, { static: false }) areasTree: TreeComponent;
  @ViewChild('opPath', {static: false}) opPathRef: OverlayPanel;

  areas: ScanTreeNode[] = [];
  services: ScanTreeNode[] = [];

  hoveredPrimaryService: string;
  hoveredSecondaryServices: string[];

  // highlightedAppCodes: string[] = [];

  private subscriptions = new Subscription();

  selectedApps: App[] = [];
  selectedServices: ScanTreeNode[] = [];
  selectedAreas: ScanTreeNode[] = [];

  appOptions: SelectItem[] = [];
  selectedAppOption: App;

  appsLoaded = false;
  wide = false;

  constructor(
    private appRelationshipService: AppRelationshipService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.appOptions = this.appsToOptions(this.appPortfolio.apps);
    this.selectedApps = this.apps;
    this.updateAreasAndServices();
    this.appsLoaded = true;

    // this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.highlightServices(app)));
    this.subscriptions.add(this.appRelationshipService.getMapApps().subscribe(apps => this.setApps(apps)));
    // this.subscriptions.add(this.appRelationshipService.getHighlightedAppCodes()
    //   .subscribe(appCodes => this.highlightApps(appCodes)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // get highlightedAppCount(): number {
  //   return this.highlightedAppCodes.length > 0
  //     ? this.apps.filter(app => this.highlightedAppCodes.includes(app.codigo)).length
  //     : -1;
  // }

  // get highlightedApps(): App[] {
  //   return this.apps.filter(app => this.highlightedAppCodes.includes(app.codigo));
  // }

  // get highlightedAppsSubset(): App[] {
  //   if (this.highlightedAppCodes.length === 0) {
  //     return this.apps;
  //   } else {
  //     return this.apps.filter(app => this.highlightedAppCodes.includes(app.codigo));
  //   }
  // }

  // get highlightedServicesSubset(): ScanTreeNode[] {
  //   if (this.highlightedAppCodes.length === 0) {
  //     return this.services;
  //   } else {
  //     return this.services.filter(service => this.highlightedApps.some(app => {
  //       return app.path.businessService.code === service.code
  //         || (app.path.secondaryServices
  //             && app.path.secondaryServices.includes(service.code));
  //     }));
  //   }
  // }

  // get highlightedAreasSubset(): ScanTreeNode[] {
  //   if (this.highlightedAppCodes.length === 0) {
  //     return this.areas;
  //   } else {
  //     return this.areas.filter(area => area.children
  //       .some(service => this.highlightedServicesSubset.map(highlightedService => highlightedService.code).includes(service.code)));
  //   }
  // }

  // private highlightApps(appCodes: string[]): void {
  //   this.highlightedAppCodes = appCodes;
  //   // TODO redo this later in a more efficient way
  //   // if (appCodes.length > 0) {
  //   //   const services = this.appPortfolio.portfolio.getServicesByApps(this.highlightedApps);
  //   //   this.areasTree.highlight(services.map(service => service.codigo));
  //   // } else {
  //   //   this.areasTree.highlight();
  //   // }
  // }

  private highlightServices(app: App) {
    if (app) {
      this.areasTree.highlight(app.path.secondaryServices, app.path.businessService && app.path.businessService.code);
      if (this.wide && !!app.path.areaOfInterest) {
        this.areasTree.scrollIntoView(app.path.areaOfInterest.code);
      }
    } else {
      this.areasTree.highlight(null);
    }
  }

  private appsToOptions(apps: App[]): SelectItem[] {
    if (apps && apps.length > 0) {
      return apps.map(app => ({
        label: `${app.codigo} - ${app.nome}`,
        title: app.nome,
        value: app
      }));
    } else {
      return [];
    }
  }

  setApps(apps: App[]): void {
    this.apps = apps;
    this.selectedApps = apps;
    this.updateAreasAndServices();
  }

  setAppsByCode(codes: string[]) {
    this.setApps(this.appPortfolio.apps.filter(app => codes.includes(app.codigo)));
  }

  private addAppsByCode(codes: string[]) {
    this.appPortfolio.apps
      .filter(app => codes.includes(app.codigo))
      .forEach(app => this.addApp(app));
  }

  private addApp(app: App) {
    if (app && !this.apps.some(existingApp => existingApp.codigo === app.codigo)) {
      this.apps.push(app);
      this.apps.sort((a, b) => a.codigo.localeCompare(b.codigo));
      this.selectedApps = this.apps;
      this.appRelationshipService.setMapApps(this.apps);
      this.updateAreasAndServices();
    }
  }

  removeApp(removedApp: App) {
    this.apps = this.apps.filter(app => app.codigo !== removedApp.codigo);
    this.selectedApps = this.apps;
    this.appRelationshipService.setMapApps(this.apps);
    this.updateAreasAndServices();
  }

  clearApps() {
    this.apps = [];
    this.services = [];
    this.areas = [];
    this.selectedApps = this.apps;
    this.selectedServices = this.services;
    this.selectedAreas = this.areas;
    this.appRelationshipService.clearMapApps();
  }

  private updateAreasAndServices() {
    this.cleanupServices();
    this.cleanupAreas();
    this.addAreasAndServices();
  }

  private cleanupServices() {
    const currentServices = Array.from(this.services);
    currentServices.forEach(currentService => {
      const service = this.appPortfolio.businessServices.find(s => s.codigo === currentService.code);
      if (service) {
        const currentPrimaries = (service.siglasPrincipais as string[]).filter(s => this.apps.some(app => app.codigo === s));
        const currentSecondaries = (service.siglasSecundarias as string[]).filter(s => this.apps.some(app => app.codigo === s));
        if (currentPrimaries.concat(currentSecondaries).length === 0) {
          this.removeService(currentService);
        }
      }
    });
  }

  private removeService(removedService: ScanTreeNode) {
    this.areas.forEach(area => {
      area.children = area.children.filter(service => service.code !== removedService.code);
    });
    this.services = this.services.filter(service => service.code !== removedService.code);
    this.selectedServices = this.services;
  }

  private cleanupAreas() {
    const currentAreas = Array.from(this.areas);
    currentAreas.forEach(currentArea => {
      if (currentArea.children.length === 0) {
        this.removeArea(currentArea);
      }
    });
  }

  private removeArea(removedArea: ScanTreeNode) {
    this.areas = this.areas.filter(area => area.code !== removedArea.code);
    this.selectedAreas = this.areas;
  }

  private addAreasAndServices() {
    this.apps.forEach(app => {
      this.addAreaAndService(app.path);
      if (app.path.secondaryServices) {
        app.path.secondaryServices.map(code => this.appPortfolio.businessServices.find(service => service.codigo === code))
          .forEach(service => this.addAreaAndService(service.path, true));
      }
    });
  }

  private addAreaAndService(path: PortfolioPath, forSecondaryService?: boolean) {
    if (path && path.areaOfInterest && path.businessService) {
      const foundArea = this.appPortfolio.areasOfInterest.find(area => area.codigo === path.areaOfInterest.code);

      if (!!foundArea) {
        const newArea: ScanTreeNode = this.addArea(foundArea.path);

        let newService: ScanTreeNode;
        if (forSecondaryService) {
          newService = this.addService(path);
        } else {
          const foundService = this.appPortfolio.businessServices.find(service => service.codigo === path.businessService.code);
          if (!!foundService) { newService = this.addService(foundService.path); }
        }

        this.addServiceToArea(newArea, newService);
      }
    }
  }

  private addArea(path: PortfolioPath): ScanTreeNode {
    const existingArea = this.areas.find(area => area.code === path.areaOfInterest.code);
    if (existingArea) {
      return existingArea;
    } else {
      const newArea: ScanTreeNode = {
        dataId: path.areaOfInterest.code,
        segment: path.segment.code,
        code: path.areaOfInterest.code,
        name: path.areaOfInterest.name,
        relatedApps: path.relatedApps,
        styleClass: 'area-of-interest',
        children: []
      };
      this.areas.push(newArea);
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
      this.selectedAreas = this.areas;
      return newArea;
    }
  }

  private addService(path: PortfolioPath): ScanTreeNode {
    const existingService = this.services.find(service => service.code === path.businessService.code);
    if (existingService) {
      return existingService;
    } else {
      const newService: ScanTreeNode = {
        dataId: path.businessService.code,
        segment: path.segment.code,
        code: path.businessService.code,
        name: path.businessService.name,
        relatedApps: path.relatedApps,
        styleClass: 'business-service'
      };
      this.services.push(newService);
      this.services.sort((a, b) => a.name.localeCompare(b.name));
      this.selectedServices = this.services;
      return newService;
    }
  }

  private addServiceToArea(newArea: ScanTreeNode, newService: ScanTreeNode) {
    if (!newArea.children) { // FIXME we may be able to delete this possibly superfluous check
      newArea.children = [];
    }
    if (!newArea.children.find(service => service.code === newService.code)) {
      newArea.children.push(newService);
      newArea.children.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  selectApp($event: any, dropdown: Dropdown) {
    this.addApp($event.value);
    this.clearValues(dropdown);
  }

  private clearValues(dropdown: Dropdown) {
    dropdown.updateSelectedOption(null);
    dropdown.resetFilter();
  }

  appClick(app: App) {
    const config = extend<DynamicDialogConfig>({
      data: { app: app, dialogLevel: 2 },
      header: `${app.codigo} – ${app.nome}`,
      styleClass: `segment-${app.path.segment.code}`,
    }, getDynamicDialogConfig());

    this.dialogService.open(AppDetailsComponent, config);
  }

  // isAppHighlighted(app: App): boolean {
  //   return this.highlightedAppCodes.includes(app.codigo);
  // }

}
