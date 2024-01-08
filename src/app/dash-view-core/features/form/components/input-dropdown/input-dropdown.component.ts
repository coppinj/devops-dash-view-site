import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectField } from '../../model';

@Component({
  selector: 'app-input-dropdown',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputDropdownComponent extends SelectField implements OnChanges {
  @Input() label!: string;
  @Input({ required: true }) override options!: any[];
  @Input() override isLocaleLabel!: boolean;
  @Input() override optionLabel!: string;
  @Input() override optionValue!: string;
  @Input() info!: string;
  @Input() override placeholder!: string;
  @Input() filter!: boolean;
  @Input() appendTo!: string;
  @Input() multiple!: boolean;

  virtualScroll: boolean;
  itemSize: number;

  constructor(
    @Optional()
      ngControl: NgControl,
    translateService: TranslateService,
    ref: ChangeDetectorRef,
  ) {
    super(ngControl, translateService, ref);
    this.placeholder = '-';
    this.virtualScroll = false;
    this.isLocaleLabel = false;
    this.itemSize = 30;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue) {
      if (this.filter === undefined && this.options.length >= 6) {
        this.filter = true;
      }

      if (this.options.length > this.itemSize) {
        this.virtualScroll = true;
      }

      this.updateItems();
    }
  }
}
