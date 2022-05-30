import { Deserializable } from '@models/common';

export class HighEndGuest implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'powerStatus': string;
  'sistemaOperacional': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
