import { Component, Input, OnInit } from '@angular/core';

import { ToolButtonSet } from '@models/ui';

@Component({
  selector: 'scan-tool-button-set',
  templateUrl: './tool-button-set.component.html',
  styleUrls: ['./tool-button-set.component.scss']
})
export class ToolButtonSetComponent implements OnInit {

  @Input() toolButtonSet: ToolButtonSet;

  constructor() { }

  ngOnInit() {
  }

}
