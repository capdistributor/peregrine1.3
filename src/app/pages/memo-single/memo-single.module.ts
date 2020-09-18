import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoSinglePageRoutingModule } from './memo-single-routing.module';

import { MemoSinglePage } from './memo-single.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoSinglePageRoutingModule
  ],
  declarations: [MemoSinglePage]
})
export class MemoSinglePageModule {}
