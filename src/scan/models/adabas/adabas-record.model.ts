import { Deserializable } from '@models/common';
import { App } from '@models/app-portfolio';

export class AdabasRecord implements Deserializable {
  'id': number;
  'numeroDbid': number;
  'origemSigla': string;
  'origemCluster': string;
  'origemInformacao': string;
  'dataHoraInformacao': string;
  'app'?: App;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.origemCluster = source.origemCluster.startsWith('PLEX')
      ? source.origemCluster
      : `PLEX${source.origemCluster}`;
    return this;
  }
}
