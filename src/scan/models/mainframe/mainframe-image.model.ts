import { Deserializable } from '@models/common';

export class MainframeImage implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'nomeCluster': string;
  'classesRelatorio'?: string[];
  'siglasCics': string[];
  'siglasBatch': string[];
  'sistemaOperacional'?: string;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.classesRelatorio = !!source.classesRelatorio ? source.classesRelatorio.split(',') : [];
    this.siglasCics = !!source.siglasCics ? source.siglasCics.split(',') : [];
    this.siglasBatch = !!source.siglasBatch ? source.siglasBatch.split(',') : [];
    if (!source.sistemaOperacional) {
      this.sistemaOperacional = this.inferOS(source.nome, source.nomeCluster);
    }
    return this;
  }

  get apps(): { cics: string[], batch: string[] } {
    return {
      cics: this.siglasCics,
      batch: this.siglasBatch
    };
  }

  // FIXME remove this when the operating system name comes from the backend
  private inferOS(name: string, clusterName: string): 'z/OS' | 'CFCC' | 'zLinux' | '' {
    if (!!clusterName) {
      if (clusterName.startsWith('PLEX')) {
        if (name.startsWith('CF')) {
          return 'CFCC';
        } else {
          return 'z/OS';
        }
      } else {
        return 'zLinux';
      }
    } else {
      return '';
    }
  }
}
