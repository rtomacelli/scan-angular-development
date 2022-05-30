import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-loading-notice',
  templateUrl: './loading-notice.component.html',
  styleUrls: ['./loading-notice.component.scss']
})
export class LoadingNoticeComponent implements OnInit {

  @Input() message = 'Carregando';

  constructor() { }

  ngOnInit() {
  }

}
