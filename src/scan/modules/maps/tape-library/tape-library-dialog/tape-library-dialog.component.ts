import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'scan-tape-library-dialog',
  templateUrl: './tape-library-dialog.component.html',
  styleUrls: ['./tape-library-dialog.component.scss']
})
export class TapeLibraryDialogComponent implements OnInit {

  constructor(
    public dialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit() {
  }

}
