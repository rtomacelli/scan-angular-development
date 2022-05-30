import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scan-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  @Input() selected: number;
  @Input() total: number;
  @Input() separator = '/';
  @Input() label: string;
  @Input() plural = this.label;
  @Input() lineBreak = false;

  get partial(): boolean {
    return this.selected > 0 && (this.selected !== this.total);
  }

  get labelText(): string {
    return this.total > 1 ? this.plural : this.label;
  }

  constructor() { }

  ngOnInit() { }

}
