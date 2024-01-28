import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepositoryListComponent } from './pages/repository-list/repository-list.component';
import { RepositoryComponent } from './pages/repository/repository.component';

const routes: Routes = [
  {
    path: 'repositories',
    children: [
      {
        path: '',
        component: RepositoryListComponent,
      },
      {
        path: ':id',
        component: RepositoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
