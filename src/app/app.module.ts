import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import localeFr from '@angular/common/locales/fr';
import { APP_INITIALIZER, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { DashViewCoreModule, TranslateService } from '@dash-view-core';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MESSAGE_FORMAT_CONFIG, TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../environments/environment';
import { appInitializerFactory } from './app-initializer.factory';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashViewCoreModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(environment.jwtTokenKey),
        allowedDomains: [
          `${environment.api.domain}${environment.api.port ? `:${environment.api.port}` : ''}`,
        ],
      },
    }),
    AppRoutingModule,
  ],
  providers: [
    { provide: MESSAGE_FORMAT_CONFIG, useValue: { locales: environment.languages } },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector, Title],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    DialogService,
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
