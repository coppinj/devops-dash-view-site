import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastService, ToastSeverity } from '../../toast';
import { TranslateService } from '../../translations';

export class CoreFormGroup extends FormGroup {
  constructor(
    formGroup: FormGroup,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {
    super(formGroup.controls, formGroup.validator, formGroup.asyncValidator);
  }

  checkValidity(showToastOnError = true): boolean {
    const isValid = this.valid;

    if (!isValid) {
      this._checkControlValidity(this);

      if (showToastOnError) {
        this.toastService.show(ToastSeverity.WARN, undefined, this.translateService.instant('CORE.FORM.INVALID'));
      }

      if (!environment.production) {
        console.error(this.errors);
      }
    }

    return isValid;
  }

  getControl(name: string): FormControl {
    return this.get(name) as FormControl;
  }

  showErrors(e: HttpErrorResponse): void {
    switch (e.status) {
      case 400:
        this.toastService.show(ToastSeverity.WARN, undefined, this.translateService.instant('CORE.FORM.RESPONSE.INVALID'));

        if (e.error.message) {
          const errors = e.error.message;

          for (const error of errors) {
            this._displayError(error);
          }
        }

        break;
      default:
        this.toastService.show(ToastSeverity.ERROR, undefined, this.translateService.instant('CORE.FORM.RESPONSE.ERROR'));

        break;
    }
  }

  showSuccess(): void {
    this.toastService.show(ToastSeverity.SUCCESS, undefined, this.translateService.instant('CORE.FORM.RESPONSE.SUCCESS'));
  }

  private _checkControlValidity(control: AbstractControl | CoreFormGroup) {
    if (control instanceof CoreFormGroup) {
      control.markAsDirty();
      control.markAsTouched();

      for (const controlName in control.controls) {
        if (!control.controls.hasOwnProperty(controlName)) {
          continue;
        }

        this._checkControlValidity(control.get(controlName)!);
      }
    }
    else {
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  private _displayError(error: { constraints: Record<string, string>, property: string, value: any }): void {
    if (!this.get(error.property)) {
      return;
    }

    const control = this.getControl(error.property);
    const errors: any = Object.assign({}, control.errors ?? {});

    for (const [validator, message] of Object.entries(error.constraints)) {
      if (!errors.custom) {
        errors.custom = [];
      }

      errors.custom.push(message);
    }

    control.setErrors(errors);
  }
}