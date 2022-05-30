import { BarGraphCategory } from '@models/ui';

export class BarGraphSegment {

  constructor(
    public name: string,
    public categories: BarGraphCategory[]
  ) { }

  getCategory(categoryName: string): BarGraphCategory {
    return this.categories.find(category => category.name === categoryName);
  }

}
