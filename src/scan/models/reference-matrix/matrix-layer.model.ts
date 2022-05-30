import { flatten } from '@helpers/js.helper';
import { deserializeArray } from '@helpers/ts.helper';
import { Deserializable } from '@models/common';
import { MatrixElement } from '@models/reference-matrix/matrix-element.model';
import { MatrixPerspective } from '@models/reference-matrix/matrix-perspective.model';
import { PERSPECTIVE_ORDER } from '@models/reference-matrix/perspective-order.model';

export class MatrixLayer implements Deserializable {
  'nomeCamada': string;
  'listaPerspectiva': MatrixPerspective[];

  deserialize(source: any): this {
    Object.assign(this, source);
    this.listaPerspectiva = deserializeArray(source, 'listaPerspectiva', MatrixPerspective)
      .sort((a, b) => PERSPECTIVE_ORDER.indexOf(a.nome) - PERSPECTIVE_ORDER.indexOf(b.nome));
    this.listaPerspectiva.forEach(perspective => perspective.fillPath(this.nomeCamada));
    return this;
  }

  get elements(): MatrixElement[] {
    return flatten(this.listaPerspectiva.map(perspective => perspective.elements));
  }
}
