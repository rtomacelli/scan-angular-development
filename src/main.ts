import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ScanModule } from 'scan/scan.module';
import { environment } from 'environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ScanModule)
  .catch(err => console.log(err));
