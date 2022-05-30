import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'scan-high-end-dialog',
  templateUrl: './high-end-dialog.component.html',
  styleUrls: ['./high-end-dialog.component.scss']
})
export class HighEndDialogComponent implements OnInit {

  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
  }

}
