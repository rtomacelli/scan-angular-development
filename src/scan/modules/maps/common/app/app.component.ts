import { Component, HostListener, Input, ViewChild } from '@angular/core';

import { OverlayPanel } from 'primeng/overlaypanel';

import { App } from '@models/app-portfolio';
// import { AppRelationshipService } from '@services/app-relationship.service';

@Component({
  selector: 'scan-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @Input() app: App;
  @Input() showName: boolean;
  @Input() showStatus: boolean;
  @Input() showPathOnHover: boolean;
  @Input() nonInteractive: boolean;
  @ViewChild('opPath', { static: false }) opPathRef: OverlayPanel;

  isHighlighted: boolean;
  isDimmed: boolean;

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: any) {
    if (/* !this.nonInteractive &&  */this.showPathOnHover) {
      this.opPathRef.show(event);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (/* !this.nonInteractive &&  */this.showPathOnHover) {
      this.opPathRef.hide();
    }
  }

}
