import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoListPage } from './memo-list.page';

const routes: Routes = [
  {
    path: '',
    component: MemoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoListPageRoutingModule {}
