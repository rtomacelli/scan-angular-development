import { deduplicate } from '@helpers/js.helper';
import { Deserializable } from '@models/common';
import { MainframeLpar } from '@models/mainframe/mainframe-lpar.model';
import { CLUSTER_TYPES } from '@models/mainframe/cluster-types.model';

export class Mainframe implements Deserializable {
  'id': number;
  'origemInformacao': string;
  'dataInformacao': string;
  'numero': string;
  'nome': string;
  'codigoModelo': string;
  'modelo': string;
  'codigoSerie': string;
  'qtdProcessadores': number;
  'qtdMemoriaRam': number;
  'qtdCapacidadeMsu': number;
  'qtdCapacidadeMips': number;
  'listaLpar': MainframeLpar[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaLpar = source.listaLpar.map((l: any) => new MainframeLpar().deserialize(l));
    return this;
  }

  get clusters(): Record<string, string[]> {
    const clusters: Record<string, string[]> = {};
    for (const type of Object.keys(CLUSTER_TYPES)) {
      clusters[type] = deduplicate(this.listaLpar
        .filter(lpar => !!lpar.imagem && !!lpar.imagem.nomeCluster
          && lpar.imagem.nomeCluster.startsWith(CLUSTER_TYPES[type]))
        .map(lpar => lpar.imagem.nomeCluster));
    }
    return clusters;
  }

  get clusterNames(): string[] {
    return [].concat(...Object.values(this.clusters)).sort();
  }

  get zOSClusters(): string[] {
    return deduplicate(this.listaLpar
      .filter(lpar => !!lpar.imagem && ['z/OS', 'CFCC'].includes(lpar.imagem.sistemaOperacional))
      .map(lpar => lpar.imagem.nomeCluster));
  }

  get zLinuxClusters(): string[] {
    return deduplicate(this.listaLpar
      .filter(lpar => !!lpar.imagem && lpar.imagem.sistemaOperacional === 'zLinux')
      .map(lpar => lpar.imagem.nomeCluster));
  }

  get hasLpars(): boolean {
    return !!this.listaLpar && this.listaLpar.length > 0;
  }
}
