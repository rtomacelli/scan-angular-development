import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Calendar } from 'primeng/calendar';

import { toISODateString } from '@helpers/js.helper';
import { PRIME_LOCALE_PT } from '@models/common';
import { ToolButtonSet } from '@models/ui';
import { ROUTES } from '@routes/local.routes';
import { ReferenceDateService } from '@services/reference-date.service';
import { RestService } from '@services/rest.service';

@Component({
  selector: 'scan-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', { static: false }) calendar: Calendar;

  @Input() title: string;
  @Input() version: string;
  @Input() timestamp: string;
  @Input() environmentName: string;
  @Input() showToolbar: boolean;

  readonly primeLocalePt = PRIME_LOCALE_PT;
  minimumDate: Date;
  defaultDate: Date;
  maximumDate: Date;
  referenceDate: Date;
  isServiceBusy = false;

  private subscriptions: Subscription = new Subscription();

  toolButtonSet: ToolButtonSet = [[
    { name: ROUTES.home.label, icon: ROUTES.home.icon, route: ROUTES.home.path, title: ROUTES.home.title },
    // TODO reinstate these routes
    // { name: ROUTES.settings.label, icon: ROUTES.settings.icon, route: `/${ROUTES.settings.path}`, title: ROUTES.settings.title },
    // { name: ROUTES.health.label, icon: ROUTES.health.icon, route: `${ROUTES.health.path}`, title: ROUTES.health.title },
    // { name: ROUTES.help.label, icon: ROUTES.help.icon, route: `/${ROUTES.help.path}`, title: ROUTES.help.title }
  ]];

  constructor(
    private referenceDateService: ReferenceDateService,
    private restService: RestService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.minimumDate = new Date(this.referenceDateService.minimumDate);
    this.defaultDate = new Date(this.referenceDateService.defaultDate);
    this.maximumDate = new Date(this.referenceDateService.maximumDate);
    this.referenceDate = new Date(this.referenceDateService.defaultDate);
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(referenceDate => this.referenceDate = referenceDate));
    this.subscriptions.add(this.restService.isBusy$.subscribe(isBusy => this.updateCalendarLock(isBusy)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get timestampAsDate(): string {
    return new Date(+this.timestamp).toLocaleString();
  }

  private updateCalendarLock(isBusy: boolean) {
    this.changeDetectorRef.detach();
    this.isServiceBusy = isBusy;
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.reattach();
  }

  onCalendarSelect() {
  if (toISODateString(this.referenceDate) !== this.referenceDateService.referenceDateString) {
      this.referenceDateService.setReferenceDate(this.referenceDate);
    }
  }

  onCalendarReset() {
    // HACK Ensure the text remains filled after resetting the calendar
    this.calendar.value = this.defaultDate;
    this.referenceDateService.resetReferenceDate();
  }

}
