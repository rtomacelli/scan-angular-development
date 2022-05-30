import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { MatrixElement } from '@models/reference-matrix/matrix-element.model';
import { MatrixPath } from '@models/reference-matrix/matrix-path.model';

export class MatrixSubgroup implements Deserializable {
  'id': number;
  'idOrigem': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'infraFisica': string;
  'perspectivaMatriz': string;
  'listaElemento': MatrixElement[];
  'path'?: MatrixPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaElemento = deserializeArray(source, 'listaElemento', MatrixElement)
      .sort((a, b) => (a.apelido || a.nome).localeCompare((b.apelido || b.nome)));
    return this;
  }

  get elements(): MatrixElement[] {
    return this.listaElemento;
  }

  fillPath(groupPath: MatrixPath): void {
    this.path = new MatrixPath(
      { code: groupPath.layer.code, name: groupPath.layer.name },
      { code: groupPath.perspective.code, name: groupPath.perspective.name },
      { code: groupPath.group.code, name: groupPath.group.name },
      { code: this.id.toString(), name: this.nome }
    );
    this.listaElemento.forEach(element => element.fillPath(this.path));
  }
}
