import { App } from '@models/app-portfolio';
import { Deserializable } from '@models/common';
import { MainframeImage } from '@models/mainframe';

export class CicsRecord implements Deserializable {
  'id': number;
  'nome': string;
  'dataMovimento': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'nomeImagem': string;
  'listaCodigoSigla': string[];
  'apps'?: App[];
  'image'?: MainframeImage;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaCodigoSigla = source.listaCodigoSigla.split(',').sort();
    return this;
  }
}
