// tslint:disable: max-line-length
export const MATRIX_PATHS = {
  // MATRIX_LEVELS                   [ LAYER                    PERSPECTIVE                GROUP            SUBGROUP                ELEMENT ]
  LOGICAL_NETWORK:                   ['Infraestrutura Lógica', 'Rede',                    '*',             '*',                    '*'],
  LOGICAL_INTERFACE:                 ['Infraestrutura Lógica', 'Interface de Aplicativo', '*',             '*',                    '*'],
  LOGICAL_INTEGRATION:               ['Infraestrutura Lógica', 'Integração Tecnológica',  '*',             '*',                    '*'],
  LOGICAL_MAINFRAME_BATCH:           ['Infraestrutura Lógica', 'Processamento',           'Processamento', 'Mainframe',            'Batch'],
  LOGICAL_MAINFRAME_CICS:            ['Infraestrutura Lógica', 'Processamento',           'Processamento', 'Mainframe',            'Online CICS Aplicação'],
  LOGICAL_DATABASE_ADABAS:           ['Infraestrutura Lógica', 'Persistência',            'Persistência',  'Banco de Dados',       'Adabas'],
  LOGICAL_DATABASE_DB2:              ['Infraestrutura Lógica', 'Persistência',            'Persistência',  'Banco de Dados',       'DB2'],
  PHYSICAL_MAINFRAME_BATCH:          ['Infraestrutura Física', 'Processamento',           'Processamento', 'Ambiente Mainframe',   'Batch'],
  PHYSICAL_MAINFRAME_CICS:           ['Infraestrutura Física', 'Processamento',           'Processamento', 'Ambiente Mainframe',   'Online CICS Aplicação'],
  PHYSICAL_HIGH_END_X86:             ['Infraestrutura Física', 'Processamento',           'Processamento', 'Ambiente Distribuído', 'x86'],
  PHYSICAL_MAINFRAME_TAPELIBRARY:    ['Infraestrutura Física', 'Persistência',            'Armazenamento', 'Ambiente Mainframe',   'Fitoteca'],
  PHYSICAL_MAINFRAME_DISK_SUBSYSTEM: ['Infraestrutura Física', 'Persistência',            'Armazenamento', 'Ambiente Mainframe',   'Subsistema de Discos']
};
// tslint:enable: max-line-length
