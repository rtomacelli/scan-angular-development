import { JobStatus, JobStatusDescriptor } from '@models/admin';

export const JOB_STATUS_DESCRIPTORS: Record<JobStatus, JobStatusDescriptor> = {
  'EM_EXECUCAO': { description: 'Em Execução', icon: 'clock-o' },
  'ERRO':        { description: 'Erro',        icon: 'times-circle' },
  'EXECUTADO':   { description: 'Executado',   icon: 'check-circle' },
  'FALHA':       { description: 'Falha',       icon: 'exclamation-triangle' },
};
