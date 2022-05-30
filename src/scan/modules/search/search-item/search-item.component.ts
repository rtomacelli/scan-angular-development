import { Component, Input } from '@angular/core';

import { SelectItemValue } from '@models/ui';

@Component({
  selector: 'scan-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent {

  @Input() item: {
    label: string,
    title: string,
    value: SelectItemValue
  };

}
