import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashViewCoreModule } from '@dash-view-core';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing.module';
import { RepositoryCreateDialogComponent } from './components/repository-create-dialog/repository-create-dialog.component';
import { RepositoryApiKeyCreateDialogComponent } from './components/repository-tabs/repository-api-key-create-dialog/repository-api-key-create-dialog.component';
import { RepositoryApiKeyTabComponent } from './components/repository-tabs/repository-api-key-tab/repository-api-key-tab.component';
import { RepositoryPipelineTabComponent } from './components/repository-tabs/repository-pipeline-tab/repository-pipeline-tab.component';
import { RepositoryListComponent } from './pages/repository-list/repository-list.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { RepositoryService } from './services/repository.service';

@NgModule({
  declarations: [
    RepositoryListComponent,
    RepositoryComponent,
    RepositoryCreateDialogComponent,
    RepositoryApiKeyCreateDialogComponent,
    RepositoryApiKeyTabComponent,
    RepositoryPipelineTabComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ButtonModule,
    DashViewCoreModule,
  ],
  providers: [
    RepositoryService,
  ],
})
export class AppModule {
}
