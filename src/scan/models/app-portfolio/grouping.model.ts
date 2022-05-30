import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { AreaOfInterest } from '@models/app-portfolio/area-of-interest.model';
import { BusinessService } from '@models/app-portfolio/business-service.model';
import { PortfolioPath } from '@models/app-portfolio/portfolio-path.model';
import { Deserializable } from '@models/common';

export class Grouping implements Deserializable {
  'id': number;
  'codigo': string;
  'nome': string;
  'descricao': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'listaAreaInteresse': AreaOfInterest[];
  'path'?: PortfolioPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaAreaInteresse = deserializeArray(source, 'listaAreaInteresse', AreaOfInterest)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    return this;
  }

  get areasOfInterest(): AreaOfInterest[] {
    return this.listaAreaInteresse;
  }

  get businessServices(): BusinessService[] {
    return flatten(this.areasOfInterest.map(area => area.businessServices))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  fillPath(segmentPath: PortfolioPath): void {
    this.path = {
      segment: { code: segmentPath.segment.code, name: segmentPath.segment.name },
      grouping: { code: this.codigo, name: this.nome }
    };
    this.areasOfInterest.forEach(area => area.fillPath(this.path));
    this.path.relatedApps = flatten(this.areasOfInterest.map(area => area.path.relatedApps));
  }
}
