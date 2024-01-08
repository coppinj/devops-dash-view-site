import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard',
  },
  {
    path: 'admin',
    canMatch: [() => true],
    loadChildren: () => import('./dash-view-modules/admin/admin.module').then(x => x.AdminModule),
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
