import { Deserializable } from '@models/common';
import { App } from '@models/app-portfolio';

export class BatchRecord implements Deserializable {
  'id': number;
  'origemInformacao': string;
  'dataInformacao': string;
  'nomeSigla': string;
  'nomeJob': string;
  'codigoSilo': string;
  'nomeCentroProducao': string;
  'qtdExecucoes': number;
  'qtdAbendados': number;
  'qtdTempoCpu': number;
  'qtdTempoSala': number;
  'app'?: App;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }
}
