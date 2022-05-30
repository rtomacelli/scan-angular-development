import { ConfigurationItemTypeDescriptor, ConfigurationItemTypes } from '@models/configuration-details';

export const CONFIGURATION_ITEM_TYPE_DESCRIPTORS: Record<ConfigurationItemTypes, ConfigurationItemTypeDescriptor> = {
  'balanceadoresLogicos':  { description: 'Balanceadores Lógicos' , icon: 'tasks'    },
  'vips':                  { description: 'VIPs'                  , icon: 'tasks'    },
  'balanceadoresFisicos':  { description: 'Balanceadores Físicos' , icon: 'tasks'    },
  'balanceadoresVirtuais': { description: 'Balanceadores Virtuais', icon: 'tasks'    },
  'dispositivos':          { description: 'Dispositivos'          , icon: 'hdd-o'    },
  'domainNames':           { description: 'Domínios'              , icon: 'font'     },
  'vlans':                 { description: 'VLANs'                 , icon: 'globe'    },
  'firewalls':             { description: 'Firewalls'             , icon: 'fire'     },
  'routers':               { description: 'Roteadores'            , icon: 'sitemap'  },
  'servidoresFisicos':     { description: 'Servidores Físicos'    , icon: 'server'   },
  'servidoresVirtuais':    { description: 'Servidores Virtuais'   , icon: 'desktop'  },
  'switches':              { description: 'Switches'              , icon: 'sitemap'  },
  'switchRouters':         { description: 'Switches Roteadores'   , icon: 'sitemap'  },
  'integraTransacao':      { description: 'Integradores'          , icon: 'exchange' },
  'originaTransacao':      { description: 'Integradores (Origem)' , icon: 'exchange' },
  'tipoTransacao':         { description: 'Integradores (Tipo)'   , icon: 'exchange' }
};
