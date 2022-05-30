import { TreeNode } from 'primeng/api';

import { Segment } from '@models/app-portfolio';
import { MatrixPerspective } from '@models/reference-matrix/matrix-perspective.model';

export interface LayerPanel {

  getComponentTree(segmentOrPerspective: Segment | MatrixPerspective): TreeNode[];

}
