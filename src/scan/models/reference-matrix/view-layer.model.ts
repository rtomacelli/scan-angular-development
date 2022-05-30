import { AppPortfolio } from '@models/app-portfolio';
import { MatrixPerspective } from '@models/reference-matrix/matrix-perspective.model';

export interface ViewLayer {
  business: boolean;
  name: string;
  id: string;
  content: AppPortfolio | MatrixPerspective[];
}
