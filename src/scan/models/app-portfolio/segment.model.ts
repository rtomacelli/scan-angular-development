import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { AreaOfInterest } from '@models/app-portfolio/area-of-interest.model';
import { BusinessService } from '@models/app-portfolio/business-service.model';
import { Grouping } from '@models/app-portfolio/grouping.model';
import { PortfolioPath } from '@models/app-portfolio/portfolio-path.model';
import { SEGMENT_ICONS } from '@models/app-portfolio/segment-icons.model';
import { Deserializable } from '@models/common';

export class Segment implements Deserializable {
  'id': number;
  'codigo': string;
  'nome': string;
  'descricao': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'listaAgrupamento': Grouping[];
  'path'?: PortfolioPath;
  'icon'?: string;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaAgrupamento = deserializeArray(source, 'listaAgrupamento', Grouping)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    this.icon = SEGMENT_ICONS[this.codigo];
    return this;
  }

  get groupings(): Grouping[] {
    return this.listaAgrupamento;
  }

  get areasOfInterest(): AreaOfInterest[] {
    return flatten(this.groupings.map(grouping => grouping.areasOfInterest))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  get businessServices(): BusinessService[] {
    return flatten(this.groupings.map(grouping => grouping.businessServices))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  fillPath() {
    this.path = {
      segment: { code: this.codigo, name: this.nome },
    };
    this.groupings.forEach(grouping => grouping.fillPath(this.path));
    this.path.relatedApps = flatten(this.groupings.map(grouping => grouping.path.relatedApps));
  }
}
