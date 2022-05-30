import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-perspective-header',
  templateUrl: './perspective-header.component.html',
  styleUrls: ['./perspective-header.component.scss']
})
export class PerspectiveHeaderComponent implements OnInit {

  @Input() segment: string;
  @Input() icon: string;
  @Input() text: string;
  @Input() tip: string;

  constructor() { }

  ngOnInit() { }

}
