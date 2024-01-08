import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormField } from '../../model';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends FormField {
  @Input() label!: string;
  @Input() required!: boolean;
  @Input() info!: string;
  @Input() override placeholder!: string;
  @Input() min!: number;
  @Input() max!: number;
  @Input() decimal!: boolean;

  constructor(ngControl: NgControl) {
    super(ngControl);
  }
}
