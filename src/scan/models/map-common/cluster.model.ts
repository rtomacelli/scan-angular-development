import { Deserializable } from '@models/common';

export class Cluster implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao'?: string;
  'dataInformacao'?: string;
  'nomeSiteOrigem'?: string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
