import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'scan-disk-storage-dialog',
  templateUrl: './disk-storage-dialog.component.html',
  styleUrls: ['./disk-storage-dialog.component.scss']
})
export class DiskStorageDialogComponent implements OnInit {

  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() { }

}
