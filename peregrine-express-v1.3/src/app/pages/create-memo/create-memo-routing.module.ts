import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMemoPage } from './create-memo.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMemoPageRoutingModule {}
