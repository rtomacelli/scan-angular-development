import { PortfolioPath } from '@models/app-portfolio';
import { MatrixPath } from '@models/reference-matrix';

export interface SelectItemValue {
    'segment': string;
    'tag': string;
    'name': string;
    'description': string;
    'status': string;
    'key': string;
    'path': PortfolioPath | MatrixPath;
    'type': 'service' | 'app' | 'interface' | 'element';
    'typeTag': 'Assunto' | 'Sigla' | 'Interface' | 'Elemento';
  }
