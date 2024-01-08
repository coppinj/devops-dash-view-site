import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormField } from '../../model';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends FormField {
  @Input() label!: string;
  @Input() required!: boolean;
  @Input() info!: string;
  @Input() maxlength!: number;
  @Input() override placeholder!: string;

  constructor(
    ngControl: NgControl,
  ) {
    super(ngControl);
  }
}
