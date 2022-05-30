import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { DataCenter } from '@models/map-common';
import { TapeLibrary } from '@models/tape-library/tape-library.model';
import { deduplicate, flatten } from '@helpers/js.helper';

export class TapeLibraryDataCenter extends DataCenter implements Deserializable {
  'listaFitoteca': TapeLibrary[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaFitoteca = deserializeArray(source, 'listaFitoteca', TapeLibrary);
    return this;
  }

  get tapeLibraries(): TapeLibrary[] {
    return this.listaFitoteca;
  }

  get clusterNames(): string[] {
    return deduplicate(flatten(this.listaFitoteca.map(tapeLibrary => tapeLibrary.clusterNames)));
  }

  get applicationNames(): string[] {
    return deduplicate(flatten(this.listaFitoteca.map(tapeLibrary => tapeLibrary.applicationNames)));
  }
}
