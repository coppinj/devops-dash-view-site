import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IRepositoryApiKeyResponseDTO } from '@dash-view-common';
import { Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-repository-api-key-response-dialog',
  templateUrl: './repository-api-key-response-dialog.component.html',
  styleUrl: './repository-api-key-response-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryApiKeyResponseDialogComponent implements OnInit {
  apiKey!: IRepositoryApiKeyResponseDTO;
  messages!: Message[];

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.apiKey = this.config.data.apiKey;

    this.messages = [
      { severity: 'success', summary: this.apiKey.apiKey, closable: false },
    ];
  }

  close(): void {
    this.ref.close();
  }
}
