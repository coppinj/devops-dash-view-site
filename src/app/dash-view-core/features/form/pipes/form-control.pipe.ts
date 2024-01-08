import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'formControl'
})
export class FormControlPipe implements PipeTransform {
  transform(value: any): FormControl<typeof value['value']> {
    return value as FormControl<typeof value['value']>
  }
}
