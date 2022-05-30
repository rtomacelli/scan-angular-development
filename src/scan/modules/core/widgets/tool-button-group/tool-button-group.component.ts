import { Component, Input, OnInit } from '@angular/core';

import { ToolButtonGroup } from '@models/ui';

@Component({
  selector: 'scan-tool-button-group',
  templateUrl: './tool-button-group.component.html',
  styleUrls: ['./tool-button-group.component.scss']
})
export class ToolButtonGroupComponent implements OnInit {

  @Input() toolButtonGroup: ToolButtonGroup;

  constructor() { }

  ngOnInit() {
  }

}
