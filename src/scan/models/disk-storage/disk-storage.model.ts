import { Deserializable } from '@models/common';

export class DiskStorage implements Deserializable {
  'id': number;
  'origemInformacao': string;
  'dataInformacao': string;
  'codigoSerial': string;
  'nomeFabricante': string;
  'modelo': string;
  'codigoAplicacao': string;
  'capacidade': 380.0;
  'dataReferencia': string;
  'nomeSysplex': string;
  'codStorDiscPrimario': number;
  'rangeMemoria': string;
  'nomeCluster': string;
  'listaSiglasArmazenadas': string[];
  'pair'?: DiskStorage;
  'category'?: 'Primária' | 'Secundária';

  deserialize(source: any): this {
    Object.assign(this, source);
    if (source.listaSiglasArmazenadas && source.listaSiglasArmazenadas.length) {
      this.listaSiglasArmazenadas = source.listaSiglasArmazenadas.split(',');
    } else {
      this.listaSiglasArmazenadas = [];
    }
    return this;
  }
}
