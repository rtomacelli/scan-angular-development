import { Component, Input, OnInit } from '@angular/core';

import { PortfolioPath } from '@models/app-portfolio';
import { MatrixPath } from '@models/reference-matrix';

@Component({
  selector: 'scan-path-overlay',
  templateUrl: './path-overlay.component.html',
  styleUrls: ['./path-overlay.component.scss']
})
export class PathOverlayComponent implements OnInit {

  @Input() type: string;
  @Input() path: PortfolioPath | MatrixPath;
  @Input() description: string;
  @Input() status: string;

  ngOnInit() { }

  get portfolioPath(): PortfolioPath {
    const portfolioPath = this.path as PortfolioPath;
    return !!portfolioPath.segment ? portfolioPath : null;
  }

  get matrixPath(): MatrixPath {
    const matrixPath = this.path as MatrixPath;
    return !!matrixPath.layer ? matrixPath : null;
  }

}
