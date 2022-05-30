import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { MatrixElement } from '@models/reference-matrix/matrix-element.model';
import { MatrixGroup } from '@models/reference-matrix/matrix-group.model';
import { MatrixPath } from '@models/reference-matrix/matrix-path.model';
import { PERSPECTIVE_ICONS } from '@models/reference-matrix/perspective-icons.model';

export class MatrixPerspective implements Deserializable {
  'id': number;
  'nome': string;
  'descricao': string;
  'camada': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'codPerspectivaOrigem': number;
  'perspectivaMatriz': string;
  'listaGrupo': MatrixGroup[];
  'path'?: MatrixPath;
  'icon'?: string;

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaGrupo = deserializeArray(source, 'listaGrupo', MatrixGroup)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    this.icon = PERSPECTIVE_ICONS[this.nome];
    return this;
  }

  fillPath(nomeCamada: string): void {
    this.path = new MatrixPath(
      { code: nomeCamada, name: nomeCamada },
      { code: this.id.toString(), name: this.nome }
    );
    this.listaGrupo.forEach(grupo => grupo.fillPath(this.path));
  }

  get elements(): MatrixElement[] {
    return flatten(this.listaGrupo.map(group => group.elements));
  }
}
