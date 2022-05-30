import { MatrixLayer } from '@models/reference-matrix/matrix-layer.model';
import { MatrixElement } from '@models/reference-matrix/matrix-element.model';
import { flatten } from '@helpers/js.helper';

export class ReferenceMatrix {
  constructor(
    public layers: MatrixLayer[],
    public date: string
  ) { }

  get elements(): MatrixElement[] {
    return flatten(this.layers.map(layer => layer.elements));
  }
}
