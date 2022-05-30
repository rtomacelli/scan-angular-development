import { Component, OnInit } from '@angular/core';

import { ROUTES } from '@routes/local.routes';

@Component({
  selector: 'scan-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  routes = ROUTES;

  constructor() { }

  ngOnInit() {
  }

}
