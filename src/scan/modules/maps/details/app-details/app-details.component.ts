import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DynamicDialogConfig } from 'primeng/api';

import { App, PortfolioPath } from '@models/app-portfolio';
import { AppPortfolioService } from '@services/app-portfolio.service';

@Component({
  selector: 'scan-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnInit {

  app: App;
  secondaryPaths: Observable<PortfolioPath[]>;

  constructor(
    private appPortfolioService: AppPortfolioService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.app = this.config.data.app;
    this.secondaryPaths = this.getSecondaryPaths();
  }

  get hasPrimaryService(): boolean {
    return !!this.app.path.segment.name;
  }

  get hasSecondaryServices(): boolean {
    return this.app.path.secondaryServices && this.app.path.secondaryServices.length > 0;
  }

  private getSecondaryPaths(): Observable<PortfolioPath[]> {
    if (this.hasSecondaryServices) {
      return this.appPortfolioService.getBusinessServices(this.app.path.secondaryServices).pipe(
        map(services => services.map(service => service.path))
      );
    } else {
      return of([]);
    }
  }

}
