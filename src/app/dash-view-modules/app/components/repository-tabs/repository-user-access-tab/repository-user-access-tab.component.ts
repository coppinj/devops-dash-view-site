import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IRepositoryUserAccessListDTO } from '@dash-view-common';
import { LoadingService, TranslateService } from '@dash-view-core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RepositoryUserAccessService } from '../../../services/repository-user-access.service';
import { RepositoryUserAccessDialogComponent } from '../repository-user-access-dialog/repository-user-access-dialog.component';

@Component({
  selector: 'app-repository-user-access-tab',
  templateUrl: './repository-user-access-tab.component.html',
  styleUrl: './repository-user-access-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryUserAccessTabComponent {
  @Input({ required: true }) repositoryID!: number;

  apiKeys!: any[];

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly repositoryUserAccessService: RepositoryUserAccessService,
    private readonly loadingService: LoadingService,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this._load();
  }

  create(): void {
    this._openModal();
  }

  delete(row: IRepositoryUserAccessListDTO): void {
    this.confirmationService.confirm({
      key: 'confirm-dialog',
      header: this.translateService.instant('CONFIRM.DELETE.HEADER'),
      accept: () => {
        this.repositoryUserAccessService.delete(row.rowID, { repositoryID: this.repositoryID }).subscribe(() => {
          this._load();
        });
      },
    });
  }

  edit(row: IRepositoryUserAccessListDTO): void {
    this._openModal(row);
  }

  private _load(): void {
    this.repositoryUserAccessService.getAll({ repositoryID: this.repositoryID }).subscribe(s => {
      this.apiKeys = s;

      this.cd.detectChanges();
    })
  }

  private _openModal(row?: IRepositoryUserAccessListDTO): void {
    const ref = this.dialogService.open(RepositoryUserAccessDialogComponent, {
      header: this.translateService.instant('REPOSITORY.TABS.USER_ACCESS.CREATE_DIALOG.HEADER'),
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        repositoryID: this.repositoryID,
      },
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      this._load();
    });
  }
}
