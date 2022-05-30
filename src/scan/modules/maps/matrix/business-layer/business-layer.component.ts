import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

import { DialogService, DynamicDialogConfig } from 'primeng/api';

import { deduplicate, extend } from '@helpers/js.helper';
import { getDynamicDialogConfig } from '@helpers/ui.helper';
import { App, AppPortfolio, AreaOfInterest, Grouping, Segment } from '@models/app-portfolio';
import { LayerPanel, ViewLayer } from '@models/reference-matrix';
import { ScanTreeNode } from '@models/ui';
import { TreeComponent } from '@modules/core/widgets';
import { AppDetailsComponent, AreaDetailsComponent } from '@modules/maps/details';
import { AppRelationshipService } from '@services/app-relationship.service';
import { MapService } from '@services/map.service';

@Component({
  selector: 'scan-business-layer',
  templateUrl: './business-layer.component.html',
  styleUrls: ['./business-layer.component.scss'],
  providers: [DialogService]
})
export class BusinessLayerComponent implements OnInit, OnDestroy, LayerPanel {

  @Input() layer: ViewLayer;
  @Input() type: string;
  @Input() mapMode: string;
  @Input() mapApps: App[] = [];

  @ViewChildren(TreeComponent) segmentTreeComponents: QueryList<TreeComponent>;

  private subscriptions: Subscription = new Subscription();

  appPortfolio: AppPortfolio;
  activeIndex = 1;
  zoom = false;
  segmentTrees: { [code: string]: ScanTreeNode[] } = {};

  views: string[] = ['Resumo', 'Portfólio', 'Segmentos'];

  constructor(
    private mapService: MapService,
    private appRelationshipService: AppRelationshipService,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.appPortfolio = this.layer.content as AppPortfolio;
    this.appPortfolio.segments.forEach(segment => this.segmentTrees[segment.codigo] = this.getComponentTree(segment));
    this.subscriptions.add(this.appRelationshipService.getMapApps().subscribe(apps => {
      this.mapApps = apps;
      this.markAreasOfInterest();
    }));
    this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.highlightAreasOfInterest(app)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getMarkedGroupingCodes(): string[] {
    if (this.mapApps && this.mapApps.length > 0) {
      const secondaryServiceCodes: string[] = Array.prototype.concat.apply([], this.mapApps.map(app => app.path.secondaryServices));
      const allSecondaryGroupingCodes = this.appPortfolio.businessServices
        .filter(service => secondaryServiceCodes.includes(service.codigo))
        .map(service => service.path.grouping.code);
      const secondaryGroupingCodes = deduplicate(allSecondaryGroupingCodes);

      const allPrimaryGroupingCodes = this.mapApps.map(app => app.path.grouping && app.path.grouping.code);
      const primaryGroupingCodes = deduplicate(allPrimaryGroupingCodes);

      return primaryGroupingCodes.concat(secondaryGroupingCodes);
    } else {
      return [];
    }
  }

  getMarkedAreaCodes(): string[] {
    if (this.mapApps && this.mapApps.length > 0) {
      const secondaryServiceCodes: string[] = Array.prototype.concat.apply([], this.mapApps.map(app => app.path.secondaryServices));
      const allSecondaryAreaCodes = this.appPortfolio.businessServices
        .filter(service => secondaryServiceCodes.includes(service.codigo))
        .map(service => service.path.areaOfInterest.code);
      const secondaryAreaCodes = deduplicate(allSecondaryAreaCodes);

      const allPrimaryAreaCodes = this.mapApps.map(app => app.path.areaOfInterest && app.path.areaOfInterest.code);
      const primaryAreaCodes = deduplicate(allPrimaryAreaCodes);

      return primaryAreaCodes.concat(secondaryAreaCodes);
    } else {
      return [];
    }
  }

  private markAreasOfInterest() {
    // this.markSegmentTrees();
  }

  private markSegmentTrees() {
    const areaCodes = this.getMarkedAreaCodes();
    if (!!this.segmentTreeComponents) {
      this.segmentTreeComponents.forEach(treeComponent => {
        if (areaCodes.length > 0) {
          treeComponent.mark(areaCodes);
        } else {
          treeComponent.mark(null);
        }
      });
    }
  }

  private highlightAreasOfInterest(app: App) {
    switch (this.activeIndex) {
      case 0:
      case 1: break;
      case 2:
        // this.highlightSegmentTrees(app);
        break;
      default:
        throw new Error(`Invalid active tab "${this.activeIndex}" on component BusinessLayerComponent`);
    }
  }

  private highlightSegmentTrees(app: App) {
    this.segmentTreeComponents.forEach(treeComponent => {
      if (app && app.path.areaOfInterest) {
        treeComponent.highlight([app.path.areaOfInterest.code]);
        treeComponent.scrollIntoView(app.path.areaOfInterest.code);
      } else {
        treeComponent.highlight(null);
      }
    });
  }

  getComponentTree(segment: Segment): ScanTreeNode[] {
    return this.groupingsToTreeNodes(segment.groupings);
  }

  private groupingsToTreeNodes(groupings: Grouping[]): ScanTreeNode[] {
    return groupings ? groupings.sort((a, b) => a.nome.localeCompare(b.nome))
      .map(grouping => ({
        dataId: grouping.codigo,
        code: grouping.codigo,
        name: grouping.nome,
        title: `${grouping.codigo} - ${grouping.nome}: ${grouping.descricao || 'Sem descrição'}`,
        data: grouping,
        relatedApps: grouping.path.relatedApps,
        styleClass: 'grouping',
        // marked: this.getMarkedGroupingCodes().includes(grouping.codigo),
        children: this.areasToTreeNodes(grouping.areasOfInterest)
      })) : null;
  }

  private areasToTreeNodes(areasOfInterest: AreaOfInterest[]): ScanTreeNode[] {
    return areasOfInterest ? areasOfInterest.sort((a, b) => a.nome.localeCompare(b.nome))
      .map(areaOfInterest => ({
        dataId: areaOfInterest.codigo,
        code: areaOfInterest.codigo,
        name: areaOfInterest.nome,
        title: areaOfInterest.descricao || 'Sem descrição',
        data: areaOfInterest,
        relatedApps: areaOfInterest.path.relatedApps,
        styleClass: 'area-of-interest',
        // marked: this.getMarkedAreaCodes().includes(areaOfInterest.codigo),
        hasDetails: true
      })) : null;
  }

  diagramClick($event: any) {
    const areaElement: SVGGElement = $event.target.closest('.area-interesse');
    if (areaElement) {
      const areaCode = areaElement.getAttribute('data-codigo');
      const areaOfInterest = this.appPortfolio.areasOfInterest.find(area => area.codigo === areaCode);
      if (areaOfInterest) {
        this.openAreaDetails(areaOfInterest);
      }
    }
  }

  treeClick(node: Grouping | AreaOfInterest) {
    if (node.codigo.startsWith('I')) { // FIXME find a less fragile way of doing this
      this.openAreaDetails(node as AreaOfInterest);
    }
  }

  private openAreaDetails(areaOfInterest: AreaOfInterest) {
    const config = extend<DynamicDialogConfig>({
      data: { areaOfInterest: areaOfInterest, mapApps: this.mapApps, dialogLevel: 2 },
      header: `${areaOfInterest.codigo} – ${areaOfInterest.nome}`,
      styleClass: `segment-${areaOfInterest.path.segment.code}`
    }, getDynamicDialogConfig());

    this.dialogService.open(AreaDetailsComponent, config);
  }

  openAppDetails(app: App) {
    const config = extend<DynamicDialogConfig>({
      data: { app: app, dialogLevel: 2 },
      header: `${app.codigo} – ${app.nome}`,
      styleClass: `segment-${app.path.segment.code}`
    }, getDynamicDialogConfig());

    this.dialogService.open(AppDetailsComponent, config);
  }

  updateMapMode(mode: string) {
    this.mapService.setMapMode(mode);
  }

}
