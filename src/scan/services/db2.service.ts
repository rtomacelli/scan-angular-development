import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { deduplicate } from '@helpers/js.helper';
import { DB2Record } from '@models/db2/db2-record.model';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class DB2Service {

  constructor(
    private restService: RestService,
    private appPortfolioService: AppPortfolioService
  ) { }

  getDB2Details(appCodes: string[], date?: string): Observable<DB2Record[]> {
    return this.restService.datedBackendPostRequest(REMOTE_ROUTES.logicalDB2Details, appCodes, date).pipe(
      map((response: any[]) => !!response ? response : []),
      map(records => records.map(record => new DB2Record().deserialize(record))),
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
