import { BusinessService } from '@models/app-portfolio/business-service.model';
import { PortfolioPath } from '@models/app-portfolio/portfolio-path.model';
import { Deserializable } from '@models/common';

export class App implements Deserializable {
  'id': number;
  'codigo': string;
  'nome': string;
  'estado': string;
  'objetivos': string;
  'diretrizes': string;
  'observacoes': string;
  'origemInformacao': string;
  'dataInicioInformacao': string;
  'dataFimInformacao': string;
  'primaryBusinessService'?: BusinessService;
  'secondaryBusinessServices'?: BusinessService[] = [];
  'path'?: PortfolioPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }

  fillPath(servicePath: PortfolioPath): void {
    this.path = {
      segment: { code: servicePath.segment.code, name: servicePath.segment.name },
      grouping: { code: servicePath.grouping.code, name: servicePath.grouping.name },
      areaOfInterest: { code: servicePath.areaOfInterest.code, name: servicePath.areaOfInterest.name },
      businessService: { code: servicePath.businessService.code, name: servicePath.businessService.name },
      app: { code: this.codigo, name: this.nome },
      secondaryServices: this.secondaryBusinessServices.map(service => service.codigo),
      secondaryAreasOfInterest: []
    };
  }
}
