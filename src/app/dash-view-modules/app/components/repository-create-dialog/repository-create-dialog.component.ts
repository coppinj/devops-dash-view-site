import { group } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { CoreFormBuilder, CoreFormGroup } from '@dash-view-core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-repository-create-dialog',
  templateUrl: './repository-create-dialog.component.html',
  styleUrl: './repository-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryCreateDialogComponent implements OnInit {
  form!: CoreFormGroup;

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly cd: ChangeDetectorRef,
    private readonly fb: CoreFormBuilder,
    private readonly ref: DynamicDialogRef,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required]],
    });
  }

  close(): void {
    this.ref.close();
  }

  submit(): void {
    if (!this.form.checkValidity()) {
      return;
    }

    this.repositoryService.create(this.form.value).subscribe({
      next: s => this.ref.close(s),
      error: e => this.form.showErrors(e),
    })
  }
}
