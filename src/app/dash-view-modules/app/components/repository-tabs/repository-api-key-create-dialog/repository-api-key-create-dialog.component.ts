import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoreFormBuilder, CoreFormGroup } from '@dash-view-core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RepositoryApiKeyService } from '../../../services/repository-api-key.service';

@Component({
  selector: 'app-repository-api-key-create-dialog',
  templateUrl: './repository-api-key-create-dialog.component.html',
  styleUrl: './repository-api-key-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryApiKeyCreateDialogComponent implements OnInit {
  form!: CoreFormGroup;
  repositoryID!: number;

  constructor(
    private readonly repositoryApiKeyService: RepositoryApiKeyService,
    private readonly cd: ChangeDetectorRef,
    private readonly fb: CoreFormBuilder,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
  ) {
  }

  ngOnInit(): void {
    this.repositoryID = this.config.data.repositoryID;

    this.form = this.fb.group({
      expirationDate: [null],
    });
  }

  close(): void {
    this.ref.close();
  }

  submit(): void {
    if (!this.form.checkValidity()) {
      return;
    }

    this.repositoryApiKeyService.create(this.form.value, { repositoryID: this.repositoryID }).subscribe({
      next: s => this.ref.close(s),
      error: e => this.form.showErrors(e),
    })
  }
}
