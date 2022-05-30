import { splitStringList } from '@helpers/js.helper';
import { App } from '@models/app-portfolio/app.model';
import { PortfolioPath } from '@models/app-portfolio/portfolio-path.model';
import { Deserializable } from '@models/common';

export class BusinessService implements Deserializable {
  'id': number;
  'codigo': string;
  'nome': string;
  'descricao': string;
  'siglasPrincipais': string[];
  'siglasSecundarias': string[];
  'origemInformacao': string;
  'dataInformacao': string;
  'primaryApps'?: App[];
  'secondaryApps'?: App[];
  'path'?: PortfolioPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.siglasPrincipais = splitStringList(source.siglasPrincipais);
    this.siglasSecundarias = splitStringList(source.siglasSecundarias);
    return this;
  }

  get hasApps(): boolean {
    return this.hasPrimaryApps || this.hasSecondaryApps;
  }

  get hasPrimaryApps(): boolean {
    return !!this.primaryApps && this.primaryApps.length > 0;
  }

  get hasSecondaryApps(): boolean {
    return !!this.secondaryApps && this.secondaryApps.length > 0;
  }

  fillPath(areaPath: PortfolioPath): void {
    this.path = {
      segment: { code: areaPath.segment.code, name: areaPath.segment.name },
      grouping: { code: areaPath.grouping.code, name: areaPath.grouping.name },
      areaOfInterest: { code: areaPath.areaOfInterest.code, name: areaPath.areaOfInterest.name },
      businessService: { code: this.codigo, name: this.nome },
      relatedApps: this.siglasPrincipais.concat(this.siglasSecundarias)
    };
    this.primaryApps.forEach(app => app.fillPath(this.path));
  }
}
