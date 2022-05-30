import { Directive, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { flatten } from '@helpers/js.helper';
import { App } from '@models/app-portfolio';
import { AppRelationshipService } from '@services/app-relationship.service';

@Directive({
  selector: '[scanDiagramHighlight]'
})
export class DiagramHighlightDirective implements OnDestroy {

  private diagram: SVGElement;
  private subscriptions = new Subscription();

  constructor(
    private appRelationshipService: AppRelationshipService,
    private renderer: Renderer2
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('onSVGInserted', ['$event']) onSVGInserted(svg: SVGElement) {
    this.diagram = svg;
    this.subscriptions.add(this.appRelationshipService.getMapApps().subscribe(apps => this.markDiagram(apps)));
    this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.highlightDiagram(app)));
  }

  private markDiagram(apps: App[]) {
    this.clearMarkings();
    this.markAreas(apps);
  }

  private highlightDiagram(app: App) {
    this.clearDiagramHighlight();
    this.highlightPrimaryArea(app);
    this.highlightSecondaryAreas(app);
  }

  private clearMarkings() {
    this.diagram.querySelectorAll<SVGGElement>('.area-interesse.marked')
      .forEach(area => this.renderer.removeClass(area, 'marked'));
  }

  private markAreas(apps: App[]) {
    const areaCodes = flatten(apps.map(app => [app.path.areaOfInterest.code].concat(app.path.secondaryAreasOfInterest)));
    if (areaCodes.length > 0) {
      const selector = areaCodes.map(code => `.area-interesse[data-codigo="${code}"]`).join(',');
      this.diagram.querySelectorAll<SVGGElement>(selector)
        .forEach(area => this.renderer.addClass(area, 'marked'));
    }
  }

  private clearDiagramHighlight() {
    this.diagram.querySelectorAll<SVGGElement>('.area-interesse.highlight')
      .forEach(area => this.renderer.removeClass(area, 'highlight'));
    this.diagram.querySelectorAll<SVGGElement>('.area-interesse.secondary-highlight')
      .forEach(area => this.renderer.removeClass(area, 'secondary-highlight'));
  }

  private highlightPrimaryArea(app: App) {
    if (app && app.path.areaOfInterest && app.path.areaOfInterest.name) {
      const area = this.diagram.querySelector<SVGGElement>(`.area-interesse[data-codigo="${app.path.areaOfInterest.code}"]`);
      this.renderer.addClass(area, 'highlight');
    }
  }

  private highlightSecondaryAreas(app: App) {
    if (app && app.path.secondaryAreasOfInterest && app.path.secondaryAreasOfInterest.length > 0) {
      const areaCodes = app.path.secondaryAreasOfInterest.filter(code => code !== app.path.areaOfInterest.code);
      if (areaCodes.length > 0) {
        const selector = areaCodes.map(code => `.area-interesse[data-codigo="${code}"]`).join(',');
        this.diagram.querySelectorAll<SVGGElement>(selector)
          .forEach(area => this.renderer.addClass(area, 'secondary-highlight'));
      }
    }
  }

}
