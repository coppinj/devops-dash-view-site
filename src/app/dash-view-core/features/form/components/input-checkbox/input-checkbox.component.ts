import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormField } from '../../model';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckboxComponent extends FormField {
  @Input() label!: string;
  @Input() required!: boolean;
  @Input() info!: string;

  constructor(
    ngControl: NgControl,
  ) {
    super(ngControl);
  }
}
