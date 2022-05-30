import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.scss']
})
export class UnderConstructionComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
