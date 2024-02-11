import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { ITranslationReadDTO } from '@dash-view-common';
import { TranslatePipe as NgxTranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '../services';

@Pipe({
  name: 'translate',
})
export class TranslatePipe extends NgxTranslatePipe implements PipeTransform {
  constructor(
    private readonly translateService: TranslateService,
    cd: ChangeDetectorRef
  ) {
    super(translateService, cd);
  }

  override transform(query: string | ITranslationReadDTO, ...args: any[]): any {
    if (!query) {
      return null;
    }

    if (typeof query === 'string') {
      return super.transform(query, ...args);
    }

    if (query.hasOwnProperty(this.translateService.currentLang)) {
      return query[this.translateService.currentLang as keyof ITranslationReadDTO];
    }

    return query.fr;
  }
}
