import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth';
import { LoadingService } from '../../../loader';
import { ToastService } from '../../../toast';
import { TranslateService } from '../../../translations';
import { MenuService } from '../../services';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutComponent implements OnInit {
  menuItems!: MenuItem[];
  loading!: boolean;

  TOAST_KEY = ToastService.KEY;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly translateService: TranslateService,
    private readonly loadingService: LoadingService,
    private readonly cd: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
  ) {
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.build();

    this.loadingService.loadingAsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      this.loading = s;

      this.cd.detectChanges();
    })
  }

  signOut(): void {
    this.authService.logout();
  }
}
