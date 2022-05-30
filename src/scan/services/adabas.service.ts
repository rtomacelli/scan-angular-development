import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { deduplicate } from '@helpers/js.helper';
import { AdabasRecord } from '@models/adabas/adabas-record.model';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AdabasService {

  constructor(
    private restService: RestService,
    private appPortfolioService: AppPortfolioService
  ) { }

  getAdabasDetails(appCodes: string[], date?: string): Observable<AdabasRecord[]> {
    return this.restService.datedBackendPostRequest(REMOTE_ROUTES.logicalAdabasDetails, appCodes, date).pipe(
      map((response: any[]) => !!response ? response : []),
      map(records => records.map(record => new AdabasRecord().deserialize(record))),
      switchMap(records => {
        const codes = deduplicate(records.map(record => record.origemSigla));
        return this.appPortfolioService.getApps(codes).pipe(
          map(apps => records.map(record => {
            record.app = apps.find(app => app.codigo === record.origemSigla);
            return record;
          }))
        );
      })
    );
  }

}
