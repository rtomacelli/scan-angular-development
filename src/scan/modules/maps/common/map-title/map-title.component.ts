import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';

import { App, BusinessService } from '@models/app-portfolio';
import { MatrixElement } from '@models/reference-matrix';

interface MapTitle {
  segment?: string;
  code?: string;
  name?: string;
  hint?: string;
}

@Component({
  selector: 'scan-map-title',
  templateUrl: './map-title.component.html',
  styleUrls: ['./map-title.component.scss']
})
export class MapTitleComponent implements OnInit, OnChanges {

  @Input() target: MatrixElement | BusinessService | App;
  @Input() type: string;
  title: MapTitle = {};

  constructor() { }

  ngOnInit() {
    this.setTitleStrings(this.target, this.type);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.target) {
      const type = !!changes.type ? changes.type.currentValue : this.type;
      this.setTitleStrings(changes.target.currentValue, type);
    }
  }

  private setTitleStrings(target: MatrixElement | BusinessService | App, type: string) {
    if (target) {
      switch (type) {
        case 'interface': this.title = this.getElementStrings(target as MatrixElement); break;
        case 'service': this.title = this.getServiceStrings(target as BusinessService); break;
        case 'app': this.title = this.getAppStrings(target as App); break;
      }
    } else {
      this.title = {};
    }
  }

  private getElementStrings(element: MatrixElement): MapTitle {
    if (element.apelido && element.apelido !== element.nome) {
      return { name: element.apelido, hint: element.nome };
    } else {
      return { name: element.nome };
    }
  }

  private getServiceStrings(service: BusinessService): MapTitle {
    return {
      segment: service.path.segment.code,
      code: service.codigo,
      name: service.nome,
      hint: service.descricao
    };
  }

  private getAppStrings(app: App): MapTitle {
    return {
      segment: app.path.segment.code,
      code: app.codigo,
      name: app.nome,
      hint: app.objetivos
    };
  }

}
