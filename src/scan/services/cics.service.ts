import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { deduplicate, flatten } from '@helpers/js.helper';
import { CicsRecord } from '@models/cics/cics-record.model';
import { REMOTE_ROUTES } from '@routes/remote.routes';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { MainframeService } from '@services/mainframe.service';
import { RestService } from '@services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class CicsService {

  constructor(
    private appPortfolioService: AppPortfolioService,
    private mainframeService: MainframeService,
    private restService: RestService
  ) { }

  getCicsDetails(appCodes: string[], date?: string): Observable<CicsRecord[]> {
    return this.restService.datedBackendPostRequest(REMOTE_ROUTES.logicalCICSDetails, appCodes, date).pipe(
      map((response: any[]) => !!response ? response : []),
      map(records => records.map(record => new CicsRecord().deserialize(record))),
      switchMap(records => {
        const codes = deduplicate(flatten(records.map(record => record.listaCodigoSigla)));
        return this.fillRecordApps(codes, records, date);
      }),
      switchMap(records => {
        const imageNames = deduplicate(records.map(record => record.nomeImagem));
        return this.fillRecordImages(imageNames, records, date);
      })
    );
  }

  private fillRecordApps(codes: string[], records: CicsRecord[], date?: string): Observable<CicsRecord[]> {
    return this.appPortfolioService.getApps(codes, date).pipe(
      map(apps => records.map(record => {
        record.apps = apps.filter(app => record.listaCodigoSigla.includes(app.codigo));
        return record;
      }))
    );
  }

  private fillRecordImages(imageNames: string[], records: CicsRecord[], date?: string): Observable<CicsRecord[]> {
    return this.mainframeService.getImagesByName(imageNames, date).pipe(map(images => records.map(record => {
      record.image = images.find(image => image.nome === record.nomeImagem);
      return record;
    })));
  }

}
