import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';
import { ITranslationDTO } from '@dash-view-common';
import { TranslateService } from '../../../translations';
import { FormField } from '../../model';

@Component({
  selector: 'app-input-i18n',
  templateUrl: './input-i18n.component.html',
  styleUrls: ['./input-i18n.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputI18nComponent extends FormField implements OnInit {
  @Input() label!: string;
  @Input() info!: string;
  @Input() maxlength!: number;
  @Input() override placeholder!: string;

  @Input() asText!: boolean;
  @Input() asRichText!: boolean;

  @Input() stacked: boolean = false;

  cultures!: (keyof ITranslationDTO)[];

  group!: FormGroup;

  value!: ITranslationDTO | null;

  private _updatingState!: boolean;

  constructor(
    ngControl: NgControl,
    cd: ChangeDetectorRef,
    private readonly translateService: TranslateService,
    private readonly fb: FormBuilder,
  ) {
    super(ngControl);
  }

  ngOnInit(): void {
    if (this.asRichText) {
      this.asText = true;
    }

    this.cultures = ['fr'];
    console.log(this.cultures);

    if (this.cultures.length === 1) {
      this.stacked = true;
    }

    this.group = this.fb.group({});

    for (const culture of this.cultures) {
      const value = this.value?.[culture as keyof ITranslationDTO] ?? null;

      this.group.addControl(culture, this.fb.control({
        value,
        disabled: this.formControl.disabled,
      }, this.ngControl.validator));

      (this.group.get(culture) as FormControl).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (this._updatingState) {
          return;
        }

        this._computeValue(culture);
      });
    }

    this.formControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.group && this.formControl.touched) {
        this._updatingState = true;

        // TODO CHECK ?

        this._updatingState = false;
      }
    });
  }

  override writeValue(value: ITranslationDTO): void {
    if (!value) {
      return;
    }

    this.value = { ...value };

    if (this.cultures) {
      for (const culture of this.cultures) {
        if (value.hasOwnProperty(culture)) {
          this.group.get(culture)?.setValue(value[culture as keyof ITranslationDTO]);
        }
      }
    }
  }

  override setDisabledState(disabled: boolean): void {
    if (this.group) {
      for (const culture of this.cultures) {
        disabled ? (this.group.get(culture) as FormControl).disable() : (this.group.get(culture) as FormControl).enable();
      }
    }
  }

  private _computeValue(culture: keyof ITranslationDTO): void {
    const value = (this.group.get(culture) as FormControl).value?.toString()?.trim();

    console.log(culture, value);
    if (!this.value) {
      this.value = {
        id: -1,
        fr: '',
      }
    }

    (this.value[culture] as any) = value === '' ? null : value;

    if (!Object.keys(this.value).filter(x => this.cultures.includes(x as keyof ITranslationDTO)).every(x => this.value![x as keyof ITranslationDTO] !== '')) {
      this.value = null;
    }

    this.onChange(this.value);
  }
}
