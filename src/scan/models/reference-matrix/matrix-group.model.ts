import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { MatrixElement } from '@models/reference-matrix/matrix-element.model';
import { MatrixPath } from '@models/reference-matrix/matrix-path.model';
import { MatrixSubgroup } from '@models/reference-matrix/matrix-subgroup.model';

export class MatrixGroup implements Deserializable {
  'id': number;
  'idOrigem': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'infraFisica': string;
  'perspectivaMatriz': string;
  'listaSubGrupo': MatrixSubgroup[];
  'path'?: MatrixPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaSubGrupo = deserializeArray(source, 'listaSubGrupo', MatrixSubgroup)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    return this;
  }

  fillPath(perspectivePath: MatrixPath): void {
    this.path = new MatrixPath(
      { code: perspectivePath.layer.code, name: perspectivePath.layer.name },
      { code: perspectivePath.perspective.code, name: perspectivePath.perspective.name },
      { code: this.id.toString(), name: this.nome }
    );
    this.listaSubGrupo.forEach(subgroup => subgroup.fillPath(this.path));
  }

  get elements(): MatrixElement[] {
    return flatten(this.listaSubGrupo.map(subgroup => subgroup.elements));
  }
}
