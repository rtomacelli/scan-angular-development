import { ScanDateTime } from '@models/common';

export interface Feature {
    'id': number;
    'rota': string;
    'nome': string;
    'descricao': string;
    'ativo': string;
    'podeSerAlterado': string;
    'dataCadastro': ScanDateTime;
    'nomeAlterador': string;
    'matriculaAlterador': string;
    'usuarioAlterador'?: string;
    'dataUltimaAlteracao'?: ScanDateTime;
}
