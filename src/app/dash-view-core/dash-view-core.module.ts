import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import {
  CurrencyPipe,
  FormControlPipe,
  FormErrorComponent,
  FormLabelComponent,
  InputCheckboxComponent,
  InputDropdownComponent,
  InputI18nComponent,
  InputNumberComponent,
  InputTextareaComponent,
  InputTextComponent,
  LoaderComponent,
  LoginComponent,
  LoginDialogComponent,
  NumberPipe,
  TranslatePipe,
} from './features';
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  declarations: [
    TranslatePipe,
    NumberPipe,
    CurrencyPipe,
    FormControlPipe,
    FormErrorComponent,
    FormLabelComponent,
    InputTextComponent,
    InputNumberComponent,
    InputI18nComponent,
    InputDropdownComponent,
    InputTextareaComponent,
    InputCheckboxComponent,
    LoaderComponent,
    LoginComponent,
    LoginDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RippleModule,
    BadgeModule,
    StyleClassModule,
    DividerModule,
    NgOptimizedImage,
    RouterLink,
    ProgressSpinnerModule,
    TooltipModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextareaModule,
    EditorModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
  ],
  exports: [
    TranslatePipe,
    NumberPipe,
    CurrencyPipe,
    FormControlPipe,
    LoaderComponent,
    InputTextComponent,
    InputCheckboxComponent,
    InputI18nComponent,
    InputDropdownComponent,
    InputNumberComponent,
    FormErrorComponent,
  ],
  providers: [
    TranslatePipe,
    NumberPipe,
    CurrencyPipe,
    FormControlPipe,
  ],
})
export class DashViewCoreModule {
}
