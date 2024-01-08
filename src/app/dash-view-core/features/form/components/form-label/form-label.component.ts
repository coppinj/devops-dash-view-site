import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLabelComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) labelFor!: string;

  @Input() info!: string;
  @Input() required!: boolean;
}
