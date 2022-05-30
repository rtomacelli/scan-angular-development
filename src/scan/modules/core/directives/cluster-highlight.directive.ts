import { Directive, ElementRef, Input, Renderer2, OnInit, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[scanClusterHighlight]'
})
export class ClusterHighlightDirective implements AfterViewInit {

  @Input() clusterName: string;
  private panel: Element;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    this.panel = this.elementRef.nativeElement.closest('.panel-content');
  }

  @HostListener('mouseenter') onMouseEnter() {
    const relatedNodes = this.panel.querySelectorAll(`[ng-reflect-cluster-name="${this.clusterName}"]`);
    if (relatedNodes && relatedNodes.length > 0) {
      relatedNodes.forEach(node => this.renderer.addClass(node, 'highlight'));
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    const relatedNodes = this.panel.querySelectorAll(`[ng-reflect-cluster-name="${this.clusterName}"]`);
    if (relatedNodes && relatedNodes.length > 0) {
      relatedNodes.forEach(node => this.renderer.removeClass(node, 'highlight'));
    }
  }

}
