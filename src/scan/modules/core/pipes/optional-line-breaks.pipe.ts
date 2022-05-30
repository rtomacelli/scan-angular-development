import { Pipe, PipeTransform } from '@angular/core';

import { addOptionalLineBreaks } from '@helpers/string.helper';

@Pipe({
  name: 'optionalLineBreaks'
})
export class OptionalLineBreaksPipe implements PipeTransform {

  transform(value: string, regex: string = '/(\W)/g'): string {
    if (!value) { return value; }
    const [, pattern, flags] = regex.split('/');
    return addOptionalLineBreaks(value, new RegExp(pattern, flags));
  }

}
