import { Deserializable } from '@models/common';

export class MapCoordinates implements Deserializable {
  'listaIdsComponentes': number[];
  'listaNomeSiglas': string[];
  'dataInformacao': string;

  deserialize(source: any): this {
    Object.assign(this, source);
    if (!source.listaIdsComponentes) { this.listaIdsComponentes = []; }
    if (!source.listaNomeSiglas) { this.listaNomeSiglas = []; }
    return this;
  }
}
