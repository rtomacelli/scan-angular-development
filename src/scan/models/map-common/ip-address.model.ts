import { Deserializable } from '@models/common';

export class IPAddress implements Deserializable {
  'id': number;
  'idAddress': string;
  'origemInformacao': string;
  'dataInformacao': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
