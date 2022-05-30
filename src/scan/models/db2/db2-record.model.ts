import { App } from '@models/app-portfolio';
import { Deserializable } from '@models/common';

export class DB2Record implements Deserializable {
  'id': number;
  'bind': number;
  'origemSigla': string;
  'siloNegocio1': string;
  'siloNegocio2': string;
  'dataSharing': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'app'?: App;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
