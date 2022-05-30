import { deduplicate, flatten } from '@helpers/js.helper';
import { Deserializable } from '@models/common';
import { MainframeLpar } from '@models/mainframe/mainframe-lpar.model';
import { Mainframe } from '@models/mainframe/mainframe.model';
import { DataCenter } from '@models/map-common';
import { CLUSTER_TYPES } from '@models/mainframe/cluster-types.model';

export class MainframeDataCenter extends DataCenter implements Deserializable {
  'listaMainframe': Mainframe[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaMainframe = source.listaMainframe.map((m: any) => new Mainframe().deserialize(m));
    return this;
  }

  get clusters(): Record<string, string[]> {
    const clusters: Record<string, string[]> = {};
    for (const type of Object.keys(CLUSTER_TYPES)) {
      clusters[type] = deduplicate(flatten(this.listaMainframe
        .map(mainframe => mainframe.clusters[type])));
    }
    return clusters;
  }

  get zOSClusters(): string[] {
    return deduplicate(flatten(this.listaMainframe.map(mainframe => mainframe.zOSClusters)));
  }

  get zLinuxClusters(): string[] {
    return deduplicate(flatten(this.listaMainframe.map(mainframe => mainframe.zLinuxClusters)));
  }

  get lpars(): MainframeLpar[] {
    return flatten(this.listaMainframe.map(mainframe => mainframe.listaLpar));
  }
}
