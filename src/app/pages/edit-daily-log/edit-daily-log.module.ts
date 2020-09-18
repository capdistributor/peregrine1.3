import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDailyLogPageRoutingModule } from './edit-daily-log-routing.module';

import { EditDailyLogPage } from './edit-daily-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditDailyLogPageRoutingModule
  ],
  declarations: [EditDailyLogPage]
})
export class EditDailyLogPageModule {}
