import { Deserializable } from '@models/common';

export class Vlan implements Deserializable {
  'id': number;
  'numero': number;
  'localizacao': string;
  'origemInformacao': string;
  'dataInformacao': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
