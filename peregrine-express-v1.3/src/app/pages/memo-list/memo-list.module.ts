import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MemoListPageRoutingModule } from './memo-list-routing.module';

import { MemoListPage } from './memo-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoListPageRoutingModule
  ],
  declarations: [MemoListPage]
})
export class MemoListPageModule {}
