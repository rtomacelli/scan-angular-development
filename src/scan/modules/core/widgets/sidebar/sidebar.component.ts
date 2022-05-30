import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { ROUTES } from '@routes/local.routes';

@Component({
  selector: 'scan-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.menuItems = [{
      label: ROUTES.map.label,
      title: ROUTES.map.title,
      icon: `fa fa-fw fa-${ROUTES.map.icon}`,
      styleClass: 'internal',
      routerLink: `/${ROUTES.map.path}`
    },
    { separator: true },
    {
      label: ROUTES.map.children.batch.label,
      title: ROUTES.map.children.batch.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.batch.icon}`,
      styleClass: 'infraestrutura-logica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.batch.path}`,
      disabled: true
    },
    { separator: true },
    {
      label: ROUTES.map.children.tapeLibrary.label,
      title: ROUTES.map.children.tapeLibrary.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.tapeLibrary.icon}`,
      styleClass: 'infraestrutura-fisica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.tapeLibrary.path}`/* ,
      disabled: true */
    }, {
      label: ROUTES.map.children.mainframeBatch.label,
      title: ROUTES.map.children.mainframeBatch.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.mainframeBatch.icon}`,
      styleClass: 'infraestrutura-fisica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.mainframeBatch.path}`
    }, {
      label: ROUTES.map.children.mainframeCics.label,
      title: ROUTES.map.children.mainframeCics.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.mainframeCics.icon}`,
      styleClass: 'infraestrutura-fisica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.mainframeCics.path}`
    }, {
      label: ROUTES.map.children.highEnd.label,
      title: ROUTES.map.children.highEnd.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.highEnd.icon}`,
      styleClass: 'infraestrutura-fisica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.highEnd.path}`
    }, {
      label: ROUTES.map.children.diskStorage.label,
      title: ROUTES.map.children.diskStorage.title,
      icon: `fa fa-fw fa-${ROUTES.map.children.diskStorage.icon}`,
      styleClass: 'infraestrutura-fisica',
      routerLink: `/${ROUTES.map.path}/${ROUTES.map.children.diskStorage.path}`
    }];
  }

}
