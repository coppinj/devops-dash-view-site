import { Injectable } from '@angular/core';
import { ITranslationDTO } from '@dash-view-common';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateService extends NgxTranslateService {
  t(translation: ITranslationDTO): string | null {
    if (!translation) {
      return null;
    }

    if (translation.hasOwnProperty(this.currentLang)) {
      return translation[this.currentLang as keyof ITranslationDTO].toString();
    }
    else if (translation.hasOwnProperty(this.defaultLang)) {
      return translation[this.defaultLang as keyof ITranslationDTO].toString();
    }

    return null;
  }
}
