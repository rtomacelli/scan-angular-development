import { Deserializable } from '@models/common';
import { MatrixPath } from '@models/reference-matrix/matrix-path.model';

export class MatrixElement implements Deserializable {
  'id': number;
  'nome': string;
  'origemInformacao': string;
  'dataInformacao': string;
  'idOrigem': number;
  'apelido': string;
  'codOrigemElementoPar': number;
  'infraFisica': string;
  'idEnumPerspectiva': number;
  'path'?: MatrixPath;

  deserialize(source: any): this {
    Object.assign(this, source);
    return this;
  }

  fillPath(subgroupPath: MatrixPath): void {
    this.path = new MatrixPath(
      { code: subgroupPath.layer.code, name: subgroupPath.layer.name },
      { code: subgroupPath.perspective.code, name: subgroupPath.perspective.name },
      { code: subgroupPath.group.code, name: subgroupPath.group.name },
      { code: subgroupPath.subgroup.code, name: subgroupPath.subgroup.name },
      { code: this.id.toString(), name: this.nome }
    );
  }

  get detailsHeader(): string {
    if (this.nome && this.apelido) {
      return `${this.nome} (${this.apelido})`;
    } else {
      return this.nome || this.apelido;
    }
  }
}
