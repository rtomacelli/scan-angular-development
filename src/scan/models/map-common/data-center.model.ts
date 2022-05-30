import { Deserializable } from '@models/common';

export class DataCenter implements Deserializable {
  'id': number;
  'codigoEnum': number;
  'predio': string;
  'complexo': string;
  'ipRange': string;
  'origemInformacao': string;
  'dataInformacao': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
