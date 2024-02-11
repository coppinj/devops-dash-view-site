import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashViewCoreModule } from '@dash-view-core';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

import { AppRoutingModule } from './app-routing.module';
import { RepositoryCreateDialogComponent } from './components/repository-create-dialog/repository-create-dialog.component';
import { RepositoryApiKeyCreateDialogComponent } from './components/repository-tabs/repository-api-key-create-dialog/repository-api-key-create-dialog.component';
import { RepositoryApiKeyResponseDialogComponent } from './components/repository-tabs/repository-api-key-response-dialog/repository-api-key-response-dialog.component';
import { RepositoryApiKeyTabComponent } from './components/repository-tabs/repository-api-key-tab/repository-api-key-tab.component';
import { RepositoryPipelineTabComponent } from './components/repository-tabs/repository-pipeline-tab/repository-pipeline-tab.component';
import { RepositoryUserAccessDialogComponent } from './components/repository-tabs/repository-user-access-dialog/repository-user-access-dialog.component';
import { RepositoryUserAccessTabComponent } from './components/repository-tabs/repository-user-access-tab/repository-user-access-tab.component';
import { RepositoryListComponent } from './pages/repository-list/repository-list.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { RepositoryService } from './services/repository.service';
import { TabViewModule } from "primeng/tabview";

@NgModule({
  declarations: [
    RepositoryListComponent,
    RepositoryComponent,
    RepositoryCreateDialogComponent,
    RepositoryApiKeyResponseDialogComponent,
    RepositoryApiKeyCreateDialogComponent,
    RepositoryApiKeyTabComponent,
    RepositoryPipelineTabComponent,
    RepositoryUserAccessDialogComponent,
    RepositoryUserAccessTabComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ButtonModule,
    DashViewCoreModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    TabViewModule,
    TableModule,
    MessagesModule,
  ],
  providers: [],
})
export class AppModule {
}
