import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number',
})
export class NumberPipe extends DecimalPipe implements PipeTransform {

  override transform(value: any): any {
    return super.transform(value, '1.0-2', 'fr-FR');
  }
}
