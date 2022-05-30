import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent implements OnInit {

  @Input() button: 1 | 2 | 3;
  @Input() key?: string;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
