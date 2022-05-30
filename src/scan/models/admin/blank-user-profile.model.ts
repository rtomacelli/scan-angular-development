import { UserProfile } from '@models/admin';
import { ScanDateTime } from '@models/common';

export const BLANK_USER_PROFILE: UserProfile = {
    id: 0,
    nome: '',
    ativo: 'S',
    podeSerAlterado: 'S',
    dataCadastro: new ScanDateTime,
    funcionalidades: []
};
