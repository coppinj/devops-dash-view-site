import { inject, NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { AuthGuard, LoginComponent, SidebarLayoutComponent } from '@dash-view-core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/repositories',
  }, {
    path: 'login',
    component: LoginComponent,
  }, {
    path: '',
    component: SidebarLayoutComponent,
    canMatch: [(_route: Route) => inject(AuthGuard).canMatch()],
    canActivate: [(_route: Route) => inject(AuthGuard).canMatch()],
    children: [
      {
        path: 'app',
        loadChildren: () => import('./dash-view-modules/app/app.module').then(x => x.AppModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dash-view-modules/dashboard/dashboard.module').then(x => x.DashboardModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('./dash-view-modules/admin/admin.module').then(x => x.AdminModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
