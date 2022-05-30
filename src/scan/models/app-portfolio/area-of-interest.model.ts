import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { BusinessService } from '@models/app-portfolio/business-service.model';
import { PortfolioPath } from '@models/app-portfolio/portfolio-path.model';
import { Deserializable } from '@models/common';

export class AreaOfInterest implements Deserializable {
  'id': number;
  'codigo': string;
  'nome': string;
  'descricao': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'listaAssuntoNegocio': BusinessService[];
  'path'?: PortfolioPath;

  deserialize(source: any) {
    Object.assign(this, source);
    this.listaAssuntoNegocio = deserializeArray(source, 'listaAssuntoNegocio', BusinessService)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    return this;
  }

  get businessServices(): BusinessService[] {
    return this.listaAssuntoNegocio
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  fillPath(groupingPath: PortfolioPath): void {
    this.path = {
      segment: { code: groupingPath.segment.code, name: groupingPath.segment.name },
      grouping: { code: groupingPath.grouping.code, name: groupingPath.grouping.name },
      areaOfInterest: { code: this.codigo, name: this.nome },
      relatedApps: flatten(this.businessServices
        .map(service => service.siglasPrincipais
          .concat(service.siglasSecundarias)))
    };
    this.businessServices.forEach(service => service.fillPath(this.path));
  }
}
