import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleType } from '@dash-view-common';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitting!: boolean;

  hasError!: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly cd: ChangeDetectorRef,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      return this._redirect();
    }

    this.form = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      return this.form.markAllAsTouched();
    }

    this.submitting = true;
    this.hasError = false;

    this.authService.login(this.form.value).subscribe({
      next: s => {
        console.log(s);
        this.submitting = false;

        if (!s) {
          this.hasError = true;

          this.cd.detectChanges();
        }
        else {
          this._redirect();
        }
      },
      error: e => {
        this.hasError = true;
        this.submitting = false;

        this.cd.detectChanges();
      },
    });
  }

  private _redirect(): void {
    switch (this.authService.role!) {
      case RoleType.ADMIN:
        this.router.navigate(['/admin']).then();
        break;
      default:
        this.router.navigate(['/']).then();
        break;
    }
  }
}
