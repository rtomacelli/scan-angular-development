import { ScanDateTime } from '@models/common';
import { Feature } from '@models/admin';

export interface UserProfile {
    'id': number;
    'nome': string;
    'ativo': string;
    'podeSerAlterado': string;
    'matriculaCadastrante'?: string;
    'nomeCadastrante'?: string;
    'dataCadastro': ScanDateTime;
    'matriculaAlterador'?: string;
    'nomeAlterador'?: string;
    'dataUltimaAlteracao'?: ScanDateTime;
    'funcionalidades': Feature[];
    'nomesFuncionalidades'?: string;
}
