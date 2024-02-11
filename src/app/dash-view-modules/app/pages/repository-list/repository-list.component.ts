import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IEntityDTO } from '@dash-view-common';
import { TranslateService } from '@dash-view-core';
import { DialogService } from 'primeng/dynamicdialog';
import { RepositoryCreateDialogComponent } from '../../components/repository-create-dialog/repository-create-dialog.component';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryListComponent implements OnInit{
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.create();
  }

  create(): void {
    const ref = this.dialogService.open(RepositoryCreateDialogComponent, {
      header: this.translateService.instant('REPOSITORY.CREATE_DIALOG.HEADER'),
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((s: IEntityDTO) => {
      if (s) {
        this.router.navigate(['/app/repositories', s.id]);
      }
    });
  }
}