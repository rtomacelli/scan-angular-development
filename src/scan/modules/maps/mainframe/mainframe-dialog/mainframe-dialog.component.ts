import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'scan-mainframe-dialog',
  templateUrl: './mainframe-dialog.component.html',
  styleUrls: ['./mainframe-dialog.component.scss']
})
export class MainframeDialogComponent implements OnInit {

  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() { }

}
