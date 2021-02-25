import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthFormComponent } from 'src/app/shared/auth-form/auth-form.component';
import { UnreadMemoAlertComponent } from './unread-memo-alert/unread-memo-alert.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthFormComponent,
    UnreadMemoAlertComponent
  ],
  exports: [
    AuthFormComponent,
    UnreadMemoAlertComponent
  ],
  entryComponents: [
    AuthFormComponent,
    UnreadMemoAlertComponent
  ]
})
export class SharedModule { }
