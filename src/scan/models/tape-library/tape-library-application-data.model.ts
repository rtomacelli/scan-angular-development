import { Deserializable } from '@models/common';

export class TapeLibraryApplicationData implements Deserializable {
  'id': number;
  'origemInformacao': string;
  'dataInformacao': string;
  'qtdCartDados': number;
  'qtdDadosGb': number;
  'origemNrFitoteca': number;
  'origemNomeAplicacao': string;
  'origemCluster': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
