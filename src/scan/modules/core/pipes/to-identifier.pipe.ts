import { Pipe, PipeTransform } from '@angular/core';

import { textToIdentifier } from '@helpers/string.helper';

@Pipe({
  name: 'toIdentifier'
})
export class ToIdentifierPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return value; }
    return textToIdentifier(value);
  }

}
