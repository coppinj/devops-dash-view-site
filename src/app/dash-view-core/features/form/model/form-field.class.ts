import { DestroyRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

export abstract class FormField implements ControlValueAccessor {
  static id = 0;

  abstract label: string;
  abstract info: string;

  fieldId: string;
  placeholder: string;

  onChange: (value: any) => any;

  protected readonly destroyRef = inject(DestroyRef);

  get formControl(): FormControl<any> {
    return this.ngControl.control as FormControl;
  }

  protected constructor(protected readonly ngControl: NgControl) {
    this.fieldId = `f${ ++FormField.id }`;

    this.placeholder = '';

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.onChange = () => {
    };
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
