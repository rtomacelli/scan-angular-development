import { UserProfile } from '@models/admin';
import { ScanDateTime } from '@models/common';

export interface Person {
    'matricula': string;
    'nomePessoa': string;
    'tipoFunc': string;
    'lotacao': string;
    'diretoria': string;
    'perfilAtivo': string;
    'dataUltimoLoginSucedido': string;
    'token': string;
    'perfis': UserProfile[];
    'nomesPerfis'?: string;
    'usuario'?: string;
    'ultimoAcesso'?: ScanDateTime;
}
