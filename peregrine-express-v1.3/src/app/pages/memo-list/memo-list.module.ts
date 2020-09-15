import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MemoListPageRoutingModule } from './memo-list-routing.module';

import { MemoListPage } from './memo-list.page';
import { ListItemComponent } from './list-item/list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoListPageRoutingModule
  ],
  declarations: [MemoListPage, ListItemComponent]
})
export class MemoListPageModule {}
