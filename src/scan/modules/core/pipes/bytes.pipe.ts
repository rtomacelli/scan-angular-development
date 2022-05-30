import { Pipe, PipeTransform } from '@angular/core';

import { formatBytes } from '@helpers/js.helper';

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  transform(value: number, order: string = 'B', binary?: 'binary' | 'decimal', precision: number = 2): string {
    if (!value) { return ''; }
    return formatBytes(value, order, binary === 'binary', precision);
  }

}
