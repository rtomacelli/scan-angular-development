import { Component, Input, OnInit } from '@angular/core';

import { PortfolioPath } from '@models/app-portfolio';

@Component({
  selector: 'scan-path-inline',
  templateUrl: './path-inline.component.html',
  styleUrls: ['./path-inline.component.scss']
})
export class PathInlineComponent implements OnInit {

  @Input() path: PortfolioPath;
  @Input() showApp = false;

  constructor() { }

  ngOnInit() {
  }

}
