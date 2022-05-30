import { Component, Input, OnInit } from '@angular/core';

import { AVATAR_URL, ORGCHART_URL } from '@routes/remote.routes';

@Component({
  selector: 'scan-user-tag',
  templateUrl: './user-tag.component.html',
  styleUrls: ['./user-tag.component.scss']
})
export class UserTagComponent implements OnInit {

  @Input() uid: string;
  @Input() name: string;

  get orgchartUrl(): string {
    return `${ORGCHART_URL}/${this.uid}`;
  }

  get avatarUrl(): string {
    return `${AVATAR_URL}/${this.uid}`;
  }

  get userIsValid(): boolean {
    return !!this.uid && !!this.name;
  }

  constructor() { }

  ngOnInit() { }

}
