import { clone, flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { App } from '@models/app-portfolio/app.model';
import { AreaOfInterest } from '@models/app-portfolio/area-of-interest.model';
import { BusinessService } from '@models/app-portfolio/business-service.model';
import { EMPTY_PORTFOLIO_PATH } from '@models/app-portfolio/empty-portfolio-path.model';
import { SEGMENT_ORDER } from '@models/app-portfolio/segment-order.model';
import { Segment } from '@models/app-portfolio/segment.model';
import { Deserializable } from '@models/common';

export class AppPortfolio implements Deserializable {
  'listaSegmento': Segment[];
  'listaSigla': App[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaSegmento = deserializeArray(source, 'listaSegmento', Segment)
      .sort((a, b) => SEGMENT_ORDER.indexOf(a.codigo) - SEGMENT_ORDER.indexOf(b.codigo));
    this.listaSigla = deserializeArray(source, 'listaSigla', App)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    this.associateServicesAndApps();
    this.fillPaths();
    this.associateSecondaryAreasToApps();
    return this;
  }

  get segments(): Segment[] {
    return this.listaSegmento;
  }

  get apps(): App[] {
    return this.listaSigla;
  }

  get businessServices(): BusinessService[] {
    return flatten(this.segments.map(segment => segment.businessServices))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  get areasOfInterest(): AreaOfInterest[] {
    return flatten(this.segments.map(segment => segment.areasOfInterest))
    .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  get servicelessApps(): App[] {
    return this.apps.filter(app => !app.path
      || !app.path.businessService
      || !app.path.businessService.name);
  }

  private associateServicesAndApps() {
    this.businessServices.forEach(service => {
      this.associateAppsToService(service);
      this.associateServiceToApps(service);
    });
  }

  private associateAppsToService(service: BusinessService) {
    service.primaryApps = this.apps.filter(app => service.siglasPrincipais.includes(app.codigo));
    service.secondaryApps = this.apps.filter(app => service.siglasSecundarias.includes(app.codigo));
  }

  private associateServiceToApps(service: BusinessService) {
    service.primaryApps.forEach(app => app.primaryBusinessService = service);
    service.secondaryApps.forEach(app => {
      if (!app.secondaryBusinessServices.find(secondaryService => secondaryService.codigo === service.codigo)) {
        app.secondaryBusinessServices.push(service);
      }
    });
  }

  private fillPaths() {
    this.segments.forEach(segment => segment.fillPath());
    this.apps.filter(app => !app.path).forEach(app => {
      app.fillPath(clone(EMPTY_PORTFOLIO_PATH));
    });
  }

  private associateSecondaryAreasToApps() {
    this.apps
      .filter(app => !!app.secondaryBusinessServices
        && app.secondaryBusinessServices.length > 0)
      .forEach(app => {
        app.path.secondaryAreasOfInterest = app.secondaryBusinessServices
          .map(service => service.path.areaOfInterest.code);
      });
  }
}
