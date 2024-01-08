import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormField } from '../../model';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextareaComponent extends FormField {
  @Input() label!: string;
  @Input() info!: string;
  @Input() required!: boolean;

  @Input() override placeholder!: string;

  @Input() rows = 4;

  @Input() asRichText!: boolean;

  constructor(
    ngControl: NgControl,
  ) {
    super(ngControl);
  }
}
