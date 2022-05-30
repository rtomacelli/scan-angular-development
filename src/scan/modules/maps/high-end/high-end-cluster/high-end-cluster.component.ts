import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { Metadata } from '@models/common';
import { HighEndGuest } from '@models/high-end';
import { HighEndHost } from '@models/high-end/high-end-host.model';
import { HighEndService } from '@services/high-end.service';

@Component({
  selector: 'scan-high-end-cluster',
  templateUrl: './high-end-cluster.component.html',
  styleUrls: ['./high-end-cluster.component.scss']
})
export class HighEndClusterComponent implements OnInit, OnDestroy {

  @ViewChild('opGuest', { static: false }) opGuestRef: OverlayPanel;

  isDataLoaded = false;
  isDataValid = true;

  totalHosts: number;
  hosts: HighEndHost[] = [];
  errorMessage = '';

  hoveredHost: HighEndHost;
  hoveredGuest: HighEndGuest;
  private subscriptions = new Subscription();

  constructor(
    private highEndService: HighEndService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    if (!!this.config && !!this.config.data) {
      this.totalHosts = this.config.data.totalHosts;
      this.loadData(this.config.data.hostIds);
    } else {
      this.isDataValid = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get hoveredGuestMetadata(): Metadata[] {
    if (this.hoveredGuest) {
      return [
        { key: 'Host', values: [this.hoveredHost.nome] },
        { key: 'Guest', values: [this.hoveredGuest.nome] },
        { key: 'Sistema Operacional', values: [this.hoveredGuest.sistemaOperacional || '—'] },
        {
          key: 'Status',
          values: [this.hoveredGuest.powerStatus],
          class: 'color-coded-tag',
          paletteName: 'host-status',
          paletteKey: `power-${this.hoveredGuest.powerStatus}`
        }
      ];
    } else {
      return [];
    }
  }

  private loadData(hostIds: number[]) {
    this.subscriptions.add(this.highEndService.getHighEndHostsByIds(hostIds).subscribe(hosts => {
      this.hosts = this.sortServers(hosts);

      this.errorMessage = this.checkData(hosts);
      this.isDataValid = this.errorMessage.length === 0;
      this.isDataLoaded = true;
    }));
  }

  private sortServers(hosts: HighEndHost[]): HighEndHost[] {
    hosts.forEach(host => host.listaServidorVirtual.sort(this.serverSorter));
    hosts.sort(this.serverSorter);
    return hosts;
  }

  private serverSorter<T extends { nome: string }>(a: T, b: T): number {
    return a.nome.localeCompare(b.nome);
  }

  private checkData(hosts: HighEndHost[]): string {
    const conditions: ValidityCondition[] = [{
      isValid: !!hosts && hosts.length > 0,
      invalidMessage: 'nenhum registro encontrado'
    }];
    return validateData(conditions);
  }

  hostHasGuests(host: HighEndHost): boolean {
    return !!host.listaServidorVirtual && host.listaServidorVirtual.length > 0;
  }

  hoverGuest(host: HighEndHost, guest: HighEndGuest, $event: any) {
    this.hoveredHost = host;
    this.hoveredGuest = guest;
    this.opGuestRef.show($event);
  }

  leaveGuest() {
    this.hoveredHost = null;
    this.hoveredGuest = null;
    this.opGuestRef.hide();
  }

}
