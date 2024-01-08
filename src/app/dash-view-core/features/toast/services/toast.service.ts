import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '../../translations';
import { ToastSeverity } from '../model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  static KEY = 'main-toast';

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
  ) {
  }

  showAndTranslate(severity: ToastSeverity, summary?: string, detail?: string): void {
    this.show(severity, summary ? this.translateService.instant(summary) : undefined, detail ? this.translateService.instant(detail) : undefined);
  }

  show(severity: ToastSeverity, summary?: string, detail?: string): void {
    if (summary === undefined || summary === null) {
      switch (severity) {
        case ToastSeverity.SUCCESS:
          summary = this.translateService.instant('CORE.TOAST.SUMMARY.SUCCESS');

          break;
        case ToastSeverity.INFO:
          summary = this.translateService.instant('CORE.TOAST.SUMMARY.INFO');

          break;
        case ToastSeverity.WARN:
          summary = this.translateService.instant('CORE.TOAST.SUMMARY.WARN');

          break;
        case ToastSeverity.ERROR:
          summary = this.translateService.instant('CORE.TOAST.SUMMARY.ERROR');

          break;
      }
    }

    this.messageService.add({
      severity,
      summary,
      detail,
      key: ToastService.KEY,
    });
  }
}
