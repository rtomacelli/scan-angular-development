import { flatten } from '@helpers/js.helper';
import { Deserializable } from '@models/common';
import { HighEndCluster } from '@models/high-end/high-end-cluster.model';
import { HighEndHost } from '@models/high-end/high-end-host.model';
import { DataCenter } from '@models/map-common';

export class HighEndDataCenter extends DataCenter implements Deserializable {
  'listaClusterDistribuido': HighEndCluster[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaClusterDistribuido = source.listaClusterDistribuido
      .map((c: any) => new HighEndCluster().deserialize(c));
    return this;
  }

  get hosts(): HighEndHost[] {
    return flatten(this.listaClusterDistribuido.map(cluster => cluster.listaServidorFisico));
  }
}
