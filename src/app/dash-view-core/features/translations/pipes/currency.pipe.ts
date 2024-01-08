import { Pipe, PipeTransform } from '@angular/core';
import { NumberPipe } from './number.pipe';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe extends NumberPipe implements PipeTransform {

  override transform(value: any): any {
    return `€ ${ super.transform(value) }`;
  }
}
