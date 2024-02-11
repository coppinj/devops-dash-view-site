import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IRepositoryReadDTO } from '@dash-view-common';
import { CoreFormBuilder, CoreFormGroup, TranslateService } from '@dash-view-core';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryComponent implements OnInit {
  id!: number;
  item!: IRepositoryReadDTO;

  form!: CoreFormGroup;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly translateService: TranslateService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: CoreFormBuilder,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      if (!s.get('id')) {
        return this.router.navigate(['/repositories']);
      }

      this.id = parseInt(s.get('id')!);

      if (isNaN(this.id)) {
        return this.router.navigate(['/repositories']);
      }

      return this._load();
    });
  }

  private _load(): void {
    this.repositoryService.get(this.id).subscribe({
      next: s => {
        this.item = s;

        this.form = this.fb.group({
          name: [null, [Validators.required]],
          url: [null, [Validators.required]],
        });

        this.form.patchValue(this.item);

        this.cd.detectChanges();
      },
      error: () => {
        return this.router.navigate(['/repositories']);
      },
    })
  }

  submit(): void {
    if (!this.form.checkValidity()) {
      return;
    }

    this.repositoryService.patch(this.form.value, this.id).subscribe({
      next: () => this.form.showSuccess(),
      error: e => this.form.showErrors(e),
    })
  }
}
