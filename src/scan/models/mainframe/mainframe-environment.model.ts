import { deduplicate, flatten } from '@helpers/js.helper';
import { MainframeDataCenter } from '@models/mainframe/mainframe-data-center.model';
import { MainframeLpar } from '@models/mainframe/mainframe-lpar.model';
import { Mainframe } from '@models/mainframe/mainframe.model';
import { CLUSTER_ORDER } from '@models/map-common';
import { CLUSTER_TYPES } from '@models/mainframe/cluster-types.model';

export class MainframeEnvironment {
  constructor(
    public dataCenters: MainframeDataCenter[],
    public date: string
  ) {
    this.sortMembers();
  }

  get hasDataCenters(): boolean {
    return !!this.dataCenters && this.dataCenters.length > 0;
  }

  get lpars(): MainframeLpar[] {
    if (this.hasDataCenters) {
      return flatten(this.dataCenters.map(dataCenter => dataCenter.lpars));
    }
    return [];
  }

  get hasLpars(): boolean {
    return this.lpars.length > 0;
  }

  get clusters(): Record<string, string[]> {
    const clusters: Record<string, string[]> = {};
    if (this.hasDataCenters) {
      for (const type of Object.keys(CLUSTER_TYPES)) {
        clusters[type] = deduplicate(flatten(this.dataCenters.map(dataCenter => dataCenter.clusters[type])))
          .sort((a, b) => CLUSTER_ORDER.indexOf(a) - CLUSTER_ORDER.indexOf(b));
      }
    }
    return clusters;
  }

  get clusterTypes(): string[] {
    return Object.keys(this.clusters).filter(type => this.clusters[type].length > 0);
  }

  get zOSClusters(): string[] {
    if (this.hasDataCenters) {
      return deduplicate(flatten(this.dataCenters.map(dataCenter => dataCenter.zOSClusters)))
        .sort(this.clusterSorter);
    }
    return [];
  }

  get zLinuxClusters(): string[] {
    if (this.hasDataCenters) {
      return deduplicate(flatten(this.dataCenters.map(dataCenter => dataCenter.zLinuxClusters)))
        .sort(this.clusterSorter);
    }
    return [];
  }

  private sortMembers() {
    if (this.hasDataCenters) {
      this.dataCenters.sort((a, b) => a.codigoEnum - b.codigoEnum);
      this.dataCenters.forEach(dataCenter => {
        dataCenter.listaMainframe.sort(this.mainframeSorter);
        dataCenter.listaMainframe.forEach(mainframe => {
          mainframe.listaLpar.sort(this.lparSorter);
        });
      });
    }
  }

  private mainframeSorter(a: Mainframe, b: Mainframe): number {
    if (a.nome === b.nome) {
      return b.listaLpar.length - a.listaLpar.length;
    } else {
      return a.nome.localeCompare(b.nome);
    }
  }

  private lparSorter(a: MainframeLpar, b: MainframeLpar): number {
    if (!!a.imagem.nome && !b.imagem.nome) {
      return -1;
    } else if (!a.imagem.nome && !!b.imagem.nome) {
      return 1;
    } else {
      return a.nome.localeCompare(b.nome);
    }
  }

  private clusterSorter(a: string, b: string): number {
    if (CLUSTER_ORDER.includes(a) && !CLUSTER_ORDER.includes(b)) {
      return -1;
    } else if (!CLUSTER_ORDER.includes(a) && CLUSTER_ORDER.includes(b)) {
      return 1;
    } else {
      return CLUSTER_ORDER.indexOf(a) - CLUSTER_ORDER.indexOf(b);
    }
  }
}
