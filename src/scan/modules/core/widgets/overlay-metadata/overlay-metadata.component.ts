import { Component, Input, OnInit } from '@angular/core';

import { Metadata } from '@models/common';

@Component({
  selector: 'scan-overlay-metadata',
  templateUrl: './overlay-metadata.component.html',
  styleUrls: ['./overlay-metadata.component.scss']
})
export class OverlayMetadataComponent implements OnInit {

  @Input() metadata: Metadata[];

  get isThereMetadata(): boolean {
    return !!this.metadata && this.metadata.length > 0;
  }

  constructor() { }

  ngOnInit() { }

}
