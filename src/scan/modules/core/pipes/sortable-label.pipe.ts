import { Pipe, PipeTransform } from '@angular/core';

import { formatSortableText } from '@helpers/string.helper';

@Pipe({
  name: 'sortableLabel'
})
export class SortableLabelPipe implements PipeTransform {

  transform(value: string, regex: string = '/^\W*/'): string {
    if (!value) { return value; }
    const [, pattern, flags] = regex.split('/');
    return formatSortableText(value, new RegExp(pattern, flags));
  }

}
