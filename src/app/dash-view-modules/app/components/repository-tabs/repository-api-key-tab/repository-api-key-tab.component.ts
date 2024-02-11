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
import { IRepositoryApiKeyListDTO } from '@dash-view-common';
import { LoadingService, TranslateService } from '@dash-view-core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RepositoryApiKeyService } from '../../../services/repository-api-key.service';
import { RepositoryApiKeyCreateDialogComponent } from '../repository-api-key-create-dialog/repository-api-key-create-dialog.component';
import { RepositoryApiKeyResponseDialogComponent } from '../repository-api-key-response-dialog/repository-api-key-response-dialog.component';

@Component({
  selector: 'app-repository-api-key-tab',
  templateUrl: './repository-api-key-tab.component.html',
  styleUrl: './repository-api-key-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryApiKeyTabComponent implements OnInit {
  @Input({ required: true }) repositoryID!: number;

  apiKeys!: any[];

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly repositoryApiKeyService: RepositoryApiKeyService,
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

  delete(row: IRepositoryApiKeyListDTO): void {
    this.confirmationService.confirm({
      key: 'confirm-dialog',
      header: this.translateService.instant('CONFIRM.DELETE.HEADER'),
      accept: () => {
        this.repositoryApiKeyService.delete(row.rowID, { repositoryID: this.repositoryID }).subscribe(() => {
          this._load();
        });
      },
    });
  }

  edit(row: IRepositoryApiKeyListDTO): void {
    this._openModal(row);
  }

  private _load(): void {
    this.repositoryApiKeyService.getAll({ repositoryID: this.repositoryID }).subscribe(s => {
      this.apiKeys = s;

      this.cd.detectChanges();
    })
  }

  private _openModal(row?: IRepositoryApiKeyListDTO): void {
    const ref = this.dialogService.open(RepositoryApiKeyCreateDialogComponent, {
      header: this.translateService.instant('REPOSITORY.TABS.API_KEY.CREATE_DIALOG.HEADER'),
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

      if (s) {
        this.dialogService.open(RepositoryApiKeyResponseDialogComponent, {
          header: this.translateService.instant('REPOSITORY.TABS.API_KEY.RESPONSE_DIALOG.HEADER'),
          width: '50vw',
          modal: true,
          breakpoints: {
            '960px': '75vw',
            '640px': '90vw',
          },
          data: {
            apiKey: s,
          },
        });
      }
    });
  }
}
