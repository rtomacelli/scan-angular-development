import { Component, Input, OnInit } from '@angular/core';

import { TOOL_BUTTON_DEFAULTS, ToolButton } from '@models/ui';

@Component({
  selector: 'scan-tool-button',
  templateUrl: './tool-button.component.html',
  styleUrls: ['./tool-button.component.scss']
})
export class ToolButtonComponent implements OnInit {

  @Input() toolButton: ToolButton;

  constructor() { }

  ngOnInit() {
    this.toolButton.class = this.toolButton.class || TOOL_BUTTON_DEFAULTS.class;
    this.toolButton.enabled = this.toolButton.hasOwnProperty('enabled')
      ? this.toolButton.enabled
      : TOOL_BUTTON_DEFAULTS.enabled;
  }

}
