import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashViewCoreModule } from '@dash-view-core';
import { Highlight } from 'ngx-highlightjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DeferModule } from 'primeng/defer';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { AppRoutingModule } from './app-routing.module';
import { RepositoryCreateDialogComponent } from './components/repository-create-dialog/repository-create-dialog.component';
import { RepositoryApiKeyCreateDialogComponent } from './components/repository-tabs/repository-api-key-create-dialog/repository-api-key-create-dialog.component';
import { RepositoryApiKeyResponseDialogComponent } from './components/repository-tabs/repository-api-key-response-dialog/repository-api-key-response-dialog.component';
import { RepositoryApiKeyTabComponent } from './components/repository-tabs/repository-api-key-tab/repository-api-key-tab.component';
import { RepositoryPipelineTabComponent } from './components/repository-tabs/repository-pipeline-tab/repository-pipeline-tab.component';
import { RepositoryUserAccessDialogComponent } from './components/repository-tabs/repository-user-access-dialog/repository-user-access-dialog.component';
import { RepositoryUserAccessTabComponent } from './components/repository-tabs/repository-user-access-tab/repository-user-access-tab.component';
import { PipelineComponent } from './pages/pipeline/pipeline.component';
import { RepositoryListComponent } from './pages/repository-list/repository-list.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { CardModule } from "primeng/card";

@NgModule({
  declarations: [
    PipelineComponent,
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
    Highlight,
    DeferModule,
    CheckboxModule,
    CardModule,
  ],
  providers: [],
})
export class AppModule {
}
