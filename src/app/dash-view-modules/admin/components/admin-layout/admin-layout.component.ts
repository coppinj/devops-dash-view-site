import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, LoadingService, ToastService, TranslateService } from '@dash-view-core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements OnInit {
  menuItems!: MenuItem[];
  loading!: boolean;

  TOAST_KEY = ToastService.KEY;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly translateService: TranslateService,
    private readonly loadingService: LoadingService,
    private readonly cd: ChangeDetectorRef,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('ADMIN.MENU.DASHBOARD'),
        routerLink: ['/admin/dashboard'],
        icon: 'bx bxs-report',
      },
      {
        label: this.translateService.instant('ADMIN.MENU.PRODUCTS'),
        routerLink: ['/admin/products'],
        icon: 'bx bx-store',
      },
      {
        label: this.translateService.instant('ADMIN.MENU.ORDERS'),
        routerLink: ['/admin/orders'],
        icon: 'bx bx-package',
      },
    ];

    this.loadingService.loadingAsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      this.loading = s;

      this.cd.detectChanges();
    })
  }

  signOut(): void {
    this.authService.logout();
  }
}
