import { ChangeDetectorRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { FormField } from './form-field.class';

export abstract class SelectField extends FormField {
  isLocaleLabel!: boolean;
  optionLabel!: string;
  optionValue!: string;
  options!: any[];

  items!: SelectItem[];

  optionLabelCb!: (item: any, lang: string) => string;

  protected constructor(
    ngControl: NgControl,
    protected readonly translateService: TranslateService,
    protected readonly cd: ChangeDetectorRef,
  ) {
    super(ngControl);

    this.optionValue = 'id';
    this.optionLabel = 'label';
  }

  protected updateItems() {
    // = Init optionLabelCb
    if (!this.optionLabelCb) {
      this.optionLabelCb =
        (!this.isLocaleLabel)
          ? (item: any, _: string) => item[this.optionLabel] as string
          : (item: any, lang: string) => item[this.optionLabel][lang] as string;
    }

    this._createSelectItems(this.translateService.currentLang);
  }

  /**
   * Create items for the select
   */
  private _createSelectItems(lang: string) {
    if (!this.options) {
      this.items = [];

      return;
    }

    this.items = this.options.slice(0);

    for (let i = 0; i < this.items.length; i++) {
      this.items[i] = {
        label: this.optionLabelCb(this.items[i], lang),
        value: (this.items[i] as any)[this.optionValue],
      };
    }

    // = Sort/Order is done in the backend
    // this.items.sort((a: SelectItem, b: SelectItem) => {
    //   return a.label.localeCompare(b.label);
    // });
    this.cd.detectChanges();
  }
}
