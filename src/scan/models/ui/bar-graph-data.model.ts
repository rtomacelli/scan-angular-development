import { flatten } from '@helpers/js.helper';
import { BarGraphSegment } from '@models/ui';

export class BarGraphData {
  constructor(
    public segments: BarGraphSegment[]
  ) { }

  get categoryNames(): string[] {
    if (!!this.segments && this.segments.length > 0
      && this.segments.some(segment => !!segment && !!segment.categories && segment.categories.length > 0)) {
      return flatten(this.segments.map(segment => segment.categories.map(category => category.name)));
    }
    return [];
  }

  getCategoryDescription(categoryName: string): string {
    if (this.areCategoriesAvailable()) {
      const segmentCategory = this.getCategoryByName(categoryName);
      if (!!segmentCategory) { return segmentCategory.description; }
    }
    return '';
  }

  getCategorySuffix(categoryName: string): string {
    if (this.areCategoriesAvailable()) {
      const segmentCategory = this.getCategoryByName(categoryName);
      if (!!segmentCategory) { return segmentCategory.suffix; }
    }
    return '';
  }

  getCategoryType(categoryName: string): 'number' | 'bytes' {
    if (this.areCategoriesAvailable()) {
      const segmentCategory = this.getCategoryByName(categoryName);
      if (!!segmentCategory) { return segmentCategory.type; }
    }
    return 'number';
  }

  getCategoryTotal(categoryName: string): number {
    if (!!this.segments && this.segments.length > 0) {
      const categoryData = flatten(
        this.segments.map(segment => segment.categories.filter(category => category.name === categoryName)));
      if (categoryData.length > 0) {
        return categoryData.reduce((total, data) => total + data.value, 0);
      }
    }
    return 0;
  }

  getSegmentPercentage(segment: BarGraphSegment, categoryName: string): number {
    if (!!segment) {
      const segmentCategory = segment.categories.find(category => category.name === categoryName);
      if (!!segmentCategory) {
        return 100 * (segmentCategory.value / this.getCategoryTotal(categoryName));
      }
    }
    return 0;
  }

  private areCategoriesAvailable() {
    return !!this.segments && this.segments.length > 0
      && !!this.segments[0].categories && this.segments[0].categories.length > 0;
  }

  private getCategoryByName(categoryName: string) {
    return this.segments[0].categories.find(category => category.name === categoryName);
  }
}
