import { version } from '../../package.json';

export const environment = {
  production: true,
  name: 'production',
  version: version,
  defaultUser: undefined,
  oldBackendUrl: 'https://scan-hm.intranet.bb.com.br:8029',
  frontendUrl: 'https://scan-hm.intranet.bb.com.br',
  backEndUrl: 'https://scan-hm.intranet.bb.com.br:8089',
  minimumDateOffset: 30,
  defaultDateOffset: 1,
  maximumDateOffset: 0
};
