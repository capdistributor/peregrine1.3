import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMemoPageRoutingModule } from './create-memo-routing.module';

import { CreateMemoPage } from './create-memo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMemoPageRoutingModule
  ],
  declarations: [CreateMemoPage]
})
export class CreateMemoPageModule {}
