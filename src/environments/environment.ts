
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { version } from '../../package.json';

export const environment = {
  production: false,
  name: 'Desenvolvimento',
  version: version,
  oldBackendUrl: 'https://scan-hm.intranet.bb.com.br:8029',
  frontendUrl: 'https://scan-local.intranet.bb.com.br',
  backEndUrl: 'https://scan-hm.intranet.bb.com.br:8089',
  minimumDateOffset: 180,
  defaultDateOffset: 1,
  maximumDateOffset: 0
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
