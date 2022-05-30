import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { formatBytes } from '@helpers/js.helper';
import { TAPE_LIBRARY_SEGMENT_ORDER } from '@models/tape-library';
import { BarGraphData, BarGraphSegment } from '@models/ui';

@Component({
  selector: 'scan-tape-library-bar-graph',
  templateUrl: './tape-library-bar-graph.component.html',
  styleUrls: ['./tape-library-bar-graph.component.scss']
})
export class TapeLibraryBarGraphComponent implements OnInit {

  @Input() data: BarGraphData;
  @Input() category: string;
  @Input() highlightKey: string;

  get isDataValid(): boolean {
    return !!this.data && this.data.categoryNames.includes(this.category);
  }

  get categoryDescription(): string {
    return this.data.getCategoryDescription(this.category);
  }

  get categoryTotal(): number {
    return this.data.getCategoryTotal(this.category);
  }

  get categorySuffix(): string {
    return this.data.getCategorySuffix(this.category);
  }

  get categoryType(): 'number' | 'bytes' {
    return this.data.getCategoryType(this.category);
  }

  get categoryValue(): string {
    if (this.categoryType === 'bytes') {
      return formatBytes(this.categoryTotal, this.categorySuffix);
    } else {
      return `${this.categoryTotal.toLocaleString()} ${this.categorySuffix || ''}`;
    }
  }

  constructor() { }

  ngOnInit() { }

  getSegmentPercentage(segment: BarGraphSegment): number {
    return this.data.getSegmentPercentage(segment, this.category);
  }

  getSegmentPercentageAsFixed(segment: BarGraphSegment, precision: number = 2): string {
    return this.getSegmentPercentage(segment).toFixed(precision);
  }

  getSegmentText(segment: BarGraphSegment): string {
    const segmentCategory = segment.getCategory(this.category);

    if (segmentCategory.type === 'bytes') {
      return formatBytes(segmentCategory.value, segmentCategory.suffix);
    } else {
      const value = segmentCategory.value.toLocaleString();
      const suffix = segmentCategory.suffix;
      return [value, suffix].filter(s => !!s).join(' ');
    }
  }

  getSegmentTitle(segment: BarGraphSegment): string {
    return `${segment.name}: ${this.getSegmentText(segment)} de ${this.categoryValue} (${this.getSegmentPercentageAsFixed(segment)}%)`;
  }

  segmentSorter(a: KeyValue<number, BarGraphSegment>, b: KeyValue<number, BarGraphSegment>): number {
    return TAPE_LIBRARY_SEGMENT_ORDER.indexOf(a.value.name) - TAPE_LIBRARY_SEGMENT_ORDER.indexOf(b.value.name);
  }

}
