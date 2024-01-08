import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

/**
 * Wait language inititialization
 */
export function appInitializerFactory(translate: TranslateService, injector: Injector, title: Title) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    locationInitialized.then(() => {
      translate.setDefaultLang(environment.defaultLanguage);
      translate.addLangs(environment.languages);
      const browserLang = translate.getBrowserLang();

      let language: string;

      if (browserLang && environment.languages.includes(browserLang)) {
        language = browserLang;
      }
      else {
        language = environment.defaultLanguage;
      }

      if (localStorage.getItem('forceLanguage')) {
        language = localStorage.getItem('forceLanguage')!;
      }

      translate.use(language).subscribe(() => {
        console.log(`Successfully initialized default language: ${ language }`);
        title.setTitle(translate.instant('APP.TITLE'));
      }, () => {
        console.error(`Problem with '${ language }' language initialization.`);
      }, () => {
        resolve(null);
      });
    });
  });
}
