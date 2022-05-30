import { Pipe, PipeTransform } from '@angular/core';

import { formatDocumentation } from '@helpers/string.helper';

@Pipe({
  name: 'documentation'
})
export class DocumentationPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return value; }
    return formatDocumentation(value);
  }

}
