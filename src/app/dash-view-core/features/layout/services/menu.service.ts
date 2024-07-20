import { Injectable } from '@angular/core';
import { RoleType } from '@dash-view-common';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth';
import { TranslateService } from '../../translations';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(
    private readonly authService: AuthService,
    private readonly translateService: TranslateService,
  ) {
  }

  build(): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: this.translateService.instant('MENU.DASHBOARD'),
        routerLink: ['/dashboard'],
        visible: false,
      },
      {
        label: this.translateService.instant('MENU.REPOSITORIES'),
        routerLink: ['/app/repositories'],
      },
    ];

    switch (this.authService.role) {
      case RoleType.ADMIN:
        break;
    }

    return items;
  }
}