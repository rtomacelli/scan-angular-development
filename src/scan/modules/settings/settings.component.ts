import { Component, OnInit } from '@angular/core';

import { ROUTES } from '@routes/local.routes';

@Component({
  selector: 'scan-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  routes = ROUTES;

  constructor() { }

  ngOnInit() { }

}
