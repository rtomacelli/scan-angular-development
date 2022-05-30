import { ScanRoutes } from '@models/common';

// tslint:disable: max-line-length
export const ROUTES: ScanRoutes = {
    home:                { path: '/',               label: 'Início',                           title: 'Página Inicial',        icon: 'home' },
    search:              { path: 'search',          label: 'Busca',                            title: '' },
    map:                 { path: 'map',             label: 'Mapa de Referência',               title: 'Planta Arquitetural',   icon: 'map', children: {
        batch:           { path: 'batch',           label: 'Mapa de Jobs Batch',               title: 'Infraestrutura Lógica', icon: 'sitemap fa-rotate-270' },
        tapeLibrary:     { path: 'tapeLibrary',     label: 'Fitoteca - Mainframe',             title: 'Infraestrutura Física', icon: 'server' },
        mainframe:       { path: 'mainframe',       label: 'Ambiente Mainframe',               title: 'Infraestrutura Física', icon: 'calendar' },
        mainframeBatch:  { path: 'mainframe/batch', label: 'Processamento Batch - Mainframe',  title: 'Infraestrutura Física', icon: 'calendar' },
        mainframeCics:   { path: 'mainframe/cics',  label: 'Processamento CICS - Mainframe',   title: 'Infraestrutura Física', icon: 'cogs' },
        highEnd:         { path: 'highEnd',         label: 'Processamento x86 - Distribuído',  title: 'Infraestrutura Física', icon: 'desktop' },
        diskStorage:     { path: 'diskStorage',     label: 'Subsistema de Discos - Mainframe', title: 'Infraestrutura Física', icon: 'database' },
    } },
    settings:            { path: 'settings',        label: 'Configurações',                    title: 'Configurações do Scan', icon: 'cog', children: {
        preferences:     { path: 'preferences',     label: 'Preferências',                     title: '' },
        admin:           { path: 'admin',           label: 'Administração',                    title: '', children: {
            features:    { path: 'features',        label: 'Funcionalidades',                  title: '' },
            profiles:    { path: 'profiles',        label: 'Perfis',                           title: '' },
            users:       { path: 'users',           label: 'Usuários',                         title: '' },
            departments: { path: 'departments',     label: 'UORs',                             title: '' },
            jobs:        { path: 'jobs',            label: 'Rotinas do Coletor',               title: '' }
        } },
        palette:         { path: 'palette',         label: 'Paleta de Cores',                  title: '' },
    } },
    health:              { path: 'health',          label: 'Saúde',                            title: 'Saúde do Serviço',      icon: 'exclamation-circle' },
    help:                { path: 'help',            label: 'Ajuda',                            title: 'Ajuda do Scan',         icon: 'question-circle' },
};
