import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from '@dash-view-core';

const routes: Routes = [
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      {
        path: 'app',
        canMatch: [() => true],
        loadChildren: () => import('./dash-view-modules/app/app.module').then(x => x.AppModule),
      },
      {
        path: 'dashboard',
        canMatch: [() => true],
        loadChildren: () => import('./dash-view-modules/dashboard/dashboard.module').then(x => x.DashboardModule),
      },
      {
        path: 'admin',
        canMatch: [() => true],
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
