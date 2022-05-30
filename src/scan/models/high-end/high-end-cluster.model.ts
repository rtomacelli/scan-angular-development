import { Deserializable } from '@models/common';
import { HighEndHost } from '@models/high-end/high-end-host.model';
import { Cluster } from '@models/map-common';

export class HighEndCluster extends Cluster implements Deserializable {
  'listaServidorFisico': HighEndHost[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaServidorFisico = source.listaServidorFisico
      .map((s: any) => new HighEndHost().deserialize(s));
    return this;
  }
}
