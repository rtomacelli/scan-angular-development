import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

import { App } from '@models/app-portfolio';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { AppRelationshipService } from '@services/app-relationship.service';

@Directive({
  selector: '[scanRelatedApps]'
})
export class RelatedAppsDirective implements OnInit, OnDestroy {

  @Input('scanRelatedApps') relatedApps: string[];
  @Input() app: App;

  @HostBinding('class.highlight') isHighlighted: boolean;
  @HostBinding('class.dimmed') isDimmed: boolean;
  @HostBinding('class.marked') isMarked: boolean;

  private subscriptions = new Subscription();

  constructor(
    private appPortfolioService: AppPortfolioService,
    private appRelationshipService: AppRelationshipService,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.appRelationshipService.getMapApps().subscribe(apps => this.mark(apps)));
    if (!!this.app) {
      this.subscriptions.add(this.appRelationshipService.getRelatedApps().subscribe(apps => this.appHighlight(apps)));
    }
    this.subscriptions.add(this.appRelationshipService.getHoveredApp().subscribe(app => this.highlight(app)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private highlight(hoveredApp: App) {
    this.isHighlighted = false;
    this.isDimmed = false;

    if (!!hoveredApp) {
      if (!!this.relatedApps && this.relatedApps.includes(hoveredApp.codigo)) {
        this.isHighlighted = true;
      } else {
        this.isDimmed = true;
      }
    }
  }

  private appHighlight(relatedApps: App[]) {
    this.isHighlighted = false;
    this.isDimmed = false;

    if (!!relatedApps && relatedApps.length > 0) {
      const relatedAppCodes = relatedApps.map(app => app.codigo);
      if (relatedAppCodes.includes(this.app.codigo)) {
        this.isHighlighted = true;
      } else {
        this.isDimmed = true;
      }
    }
  }

  private mark(mapApps: App[]) {
    this.isMarked = false;

    if (!!mapApps && mapApps.length > 0) {
      const appCodes = mapApps.map(app => app.codigo);
      if (this.relatedApps.some(relatedApp => appCodes.includes(relatedApp))) {
        this.isMarked = true;
      }
    }
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: Event): any {
    // event.stopPropagation();
    this.isHighlighted = true;
    if (!!this.app) {
      this.appRelationshipService.setHoveredApp(this.app);
    } else {
      this.appPortfolioService.getApps(this.relatedApps).subscribe(apps => {
        // console.log('onMouseEnter()', event.target, apps);
        this.appRelationshipService.setRelatedApps(apps);
      }).unsubscribe();
    }
    // return false;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHighlighted = false;
    if (!!this.app) {
      this.appRelationshipService.clearHoveredApp();
    } else {
      this.appRelationshipService.clearRelatedApps();
    }
  }

}
