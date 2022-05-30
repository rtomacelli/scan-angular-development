import { JobStatus } from '@models/admin';
import { ScanDateTime } from '@models/common';

export interface Job {
  'id': number;
  'job': string;
  'rotinaExecutora': string;
  'jobStatus': JobStatus;
  'ultimaMensagemErro': string;
  'ultimaMensagemObservacao': string;
  'ultimaMensagem'?: string;
  'duracao': string;
  'inicioExecucao': ScanDateTime;
  'finalExecucao': ScanDateTime;
  'dataExecucao'?: string;
}
