import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

import { extend } from '@helpers/js.helper';
import { getDynamicDialogConfig } from '@helpers/ui.helper';
import { App, AreaOfInterest, BusinessService } from '@models/app-portfolio';
import { AppDetailsComponent } from '@modules/maps/details/app-details/app-details.component';
import { AppPortfolioService } from '@services/app-portfolio.service';

@Component({
  selector: 'scan-area-details',
  templateUrl: './area-details.component.html',
  styleUrls: ['./area-details.component.scss'],
  providers: [DialogService]
})
export class AreaDetailsComponent implements OnInit {

  areaOfInterest: AreaOfInterest;
  private mapApps: App[] = [];

  constructor(
    private router: Router,
    private appPortfolioService: AppPortfolioService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.areaOfInterest = this.config.data.areaOfInterest;
    this.mapApps = this.config.data.mapApps;
  }

  appClick(app: App) {
    const config = extend<DynamicDialogConfig>({
      data: { app: app, dialogLevel: this.config.data.dialogLevel + 1 },
      header: `${app.codigo} – ${app.nome}`,
      styleClass: `segment-${app.path.segment.code}`,
    }, getDynamicDialogConfig(this.config.data.dialogLevel));

    this.dialogService.open(AppDetailsComponent, config);
  }

  goToMap(type: string, code: string) {
    this.ref.close();
    this.router.navigateByUrl(`/map/${type}/${code}`);
  }

  isServiceMarked(service: BusinessService): boolean {
    return (service.hasPrimaryApps
        && this.mapApps.some(mapApp => (service.siglasPrincipais as string[]).includes(mapApp.codigo)))
      || service.hasSecondaryApps
        && this.mapApps.some(mapApp => (service.siglasSecundarias as string[]).includes(mapApp.codigo));
  }

  isAppMarked(app: App): boolean {
    return this.mapApps.some(mapApp => mapApp.codigo === app.codigo);
  }

}
