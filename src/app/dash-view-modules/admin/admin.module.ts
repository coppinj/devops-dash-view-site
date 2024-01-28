import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DashViewCoreModule } from '@dash-view-core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RippleModule,
    NgOptimizedImage,
    StyleClassModule,
    BadgeModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DashViewCoreModule,
    CardModule,
    TabViewModule,
    CheckboxModule,
    ReactiveFormsModule,
    FileUploadModule,
    ConfirmDialogModule,
    ToastModule,
  ],
})
export class AdminModule {
}
