import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DialogService, DynamicDialogConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { extend } from '@helpers/js.helper';
import { getDynamicDialogConfig } from '@helpers/ui.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { Metadata } from '@models/common';
import { HighEndCluster, HighEndDataCenter, HighEndEnvironment, HighEndHost } from '@models/high-end';
import { HighEndClusterComponent } from '@modules/maps/high-end/high-end-cluster/high-end-cluster.component';
import { HighEndService } from '@services/high-end.service';
import { ReferenceDateService } from '@services/reference-date.service';

@Component({
  selector: 'scan-high-end',
  templateUrl: './high-end.component.html',
  styleUrls: ['./high-end.component.scss'],
  providers: [DialogService]
})
export class HighEndComponent implements OnInit, OnDestroy {

  @ViewChild('opHost', { static: false }) opHostRef: OverlayPanel;
  @Input() config: DynamicDialogConfig;

  highEndEnvironment: HighEndEnvironment;
  isDataLoaded: boolean;
  isDataValid = true;
  errorMessage: string;
  private subscriptions: Subscription = new Subscription();

  hoveredHost: HighEndHost;
  hoveredCluster: HighEndCluster;

  constructor(
    private referenceDateService: ReferenceDateService,
    private highEndService: HighEndService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadData()));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get inDynamicDialog(): boolean {
    return !!this.config;
  }

  get dynamicDialogLevel(): number {
    if (this.inDynamicDialog) {
      if (!!this.config.data && !!this.config.data.dialogLevel) {
        return this.config.data.dialogLevel + 1;
      }
      return 2;
    }
    return 1;
  }

  get hoveredHostMetadata(): Metadata[] {
    if (this.hoveredHost) {
      return [
        { key: 'Nome', values: [this.hoveredHost.nome] },
        { key: 'Marca e Modelo', values: [`${this.hoveredHost.vendor} ${this.hoveredHost.modelo}`] },
        { key: 'Serial', values: [this.hoveredHost.serial] },
        { key: 'Memória', values: [this.hoveredHost.memoria], suffix: 'GB' },
        { key: 'Núcleos', values: [this.hoveredHost.qtdCores] },
        { key: 'Sistema Operacional', values: [[
          this.hoveredHost.sistemaOperacional,
          this.hoveredHost.versao,
          `(${this.hoveredHost.build})`
        ].join(' ')] },
        { key: 'Endereços IP', values: this.hoveredHost.listaEnderecoIP.map(ip => ip.idAddress) },
        { key: 'Servidores virtuais', values: [this.hoveredHost.qtdServidoresVirtuais] },
        {
          key: 'Funcionamento',
          values: [this.hoveredHost.powerStatus],
          class: 'color-coded-tag',
          paletteName: 'host-status',
          paletteKey: `power-${this.hoveredHost.powerStatus}`
        },
        {
          key: 'Conexão',
          values: [this.hoveredHost.connectionStatus],
          class: 'color-coded-tag',
          paletteName: 'host-status',
          paletteKey: `connection-${this.hoveredHost.connectionStatus}`,
          icon: this.isHostConnected(this.hoveredHost) ? 'chain' : 'chain-broken'
        },
      ];
    } else {
      return [];
    }
  }

  private loadData() {
    this.isDataLoaded = false;

    this.subscriptions.add(
      this.highEndService.getHighEndEnvironment()
        .subscribe(highEndEnvironment => {
          this.highEndEnvironment = highEndEnvironment;

          this.isDataLoaded = true;
          this.isDataValid = this.checkData(this.highEndEnvironment);
        })
    );
  }

  private checkData(highEndEnvironment: HighEndEnvironment): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!highEndEnvironment.dataCenters && highEndEnvironment.dataCenters.length > 0,
      invalidMessage: 'data centers não encontrados'
    }, {
      isValid: !!highEndEnvironment.clusters && highEndEnvironment.clusters.length > 0,
      invalidMessage: 'clusters não encontrados'
    }, {
      isValid: !!highEndEnvironment.hosts && highEndEnvironment.hosts.length > 0,
      invalidMessage: 'hosts não encontrados'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  hoverHost(host: HighEndHost, $event: any) {
    this.hoveredHost = host;
    this.opHostRef.show($event);
  }

  leaveHost() {
    this.hoveredHost = null;
    this.opHostRef.hide();
  }

  hoverCluster(cluster: HighEndCluster) {
    this.hoveredCluster = cluster;
  }

  leaveCluster() {
    this.hoveredCluster = null;
  }

  isHostConnected(host: HighEndHost): boolean {
    return host.connectionStatus === 'connected';
  }

  isHostPoweredOn(host: HighEndHost): boolean {
    return host.powerStatus === 'poweredOn';
  }

  showCluster(dataCenter: HighEndDataCenter, cluster: HighEndCluster, host?: HighEndHost) {
    const hostIds = !!host ? [host.id] : cluster.listaServidorFisico.map(clusterHost => clusterHost.id);
    const config = extend<DynamicDialogConfig>({
      data: { hostIds: hostIds, totalHosts: cluster.listaServidorFisico.length, dialogLevel: this.dynamicDialogLevel + 1 },
      header: [dataCenter.complexo, dataCenter.predio, `Cluster ${cluster.nome}`].join(' – '),
      styleClass: 'scan-high-end-cluster-dialog'
    }, getDynamicDialogConfig(this.dynamicDialogLevel));
    this.dialogService.open(HighEndClusterComponent, config);
  }

}
