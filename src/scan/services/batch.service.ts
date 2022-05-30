import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BatchRecord } from '@models/batch/batch-record.model';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { RestService } from '@services/rest.service';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { map, switchMap } from 'rxjs/operators';
import { deduplicate } from '@helpers/js.helper';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(
    private appPortfolioService: AppPortfolioService,
    private restService: RestService
  ) { }

  getBatchDetails(appCodes: string[], date?: string): Observable<BatchRecord[]> {
    return this.restService.datedBackendPostRequest(REMOTE_ROUTES.logicalBatchDetails, appCodes, date).pipe(
      map((response: any[]) => !!response ? response : []),
      map(records => records.map(record => new BatchRecord().deserialize(record))),
      switchMap(records => {
        const codes = deduplicate(records.map(record => record.nomeSigla));
        return this.fillRecordApps(codes, records, date);
      })
    );
  }

  private fillRecordApps(appCodes: string[], records: BatchRecord[], date?: string): Observable<BatchRecord[]> {
    return this.appPortfolioService.getApps(appCodes, date).pipe(
      map(apps => records.map(record => {
        record.app = apps.find(app => app.codigo === record.nomeSigla);
        return record;
      }))
    );
  }

}
