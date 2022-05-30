import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-notice-panel',
  templateUrl: './notice-panel.component.html',
  styleUrls: ['./notice-panel.component.scss']
})
export class NoticePanelComponent implements OnInit {

  @Input() withToolbar: boolean;
  @Input() subject?: string;
  @Input() title?: string;
  @Input() noticeIcon: string;
  @Input() severity?: 'default' | 'success' | 'info' | 'warning' | 'danger';
  @Input() message: string;
  @Input() message2?: string;
  @Input() routerLink: string;
  @Input() linkIcon: string;
  @Input() linkText: string;

  constructor() { }

  ngOnInit() {
  }

}
