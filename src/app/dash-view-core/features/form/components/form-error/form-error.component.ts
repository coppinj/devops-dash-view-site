import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent implements OnInit {
  @Input({ required: true }) control!: AbstractControl;

  requiredError!: boolean;
  errors!: string[];

  private readonly destroyRef = inject(DestroyRef);

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.handleErrors();

    this.control.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.handleErrors();
      this.cd.detectChanges();
    });
  }

  private handleErrors() {
    if (!this.control.errors) {
      return;
    }

    // = Required is priority
    if (this.control.errors['required']) {
      this.requiredError = true;

      return;
    }
    else {
      this.requiredError = false;
    }

    this.errors = Object.keys(this.control.errors).filter(x => x !== 'required');
  }
}
