import { Deserializable } from '@models/common';
import { MainframeImage } from '@models/mainframe/mainframe-image.model';

export class MainframeLpar implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'listaImagem': MainframeImage[]; // FIXME remove this
  'imagem'?: MainframeImage;

  deserialize(source: any): this {
    Object.assign(this, source);
    if (source.listaImagem) {
      this.listaImagem = source.listaImagem.map((i: any) => new MainframeImage().deserialize(i)); // FIXME remove this
      this.imagem = new MainframeImage().deserialize(source.listaImagem[0]);
    } else {
      this.imagem = new MainframeImage();
    }
    return this;
  }

  get apps(): { cics: string[], batch: string[] } {
    return {
      cics: this.imagem ? this.imagem.apps.cics : [],
      batch: this.imagem ? this.imagem.apps.batch : [],
    };
  }
}
