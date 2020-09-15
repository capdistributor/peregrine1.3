import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoSinglePage } from './memo-single.page';

const routes: Routes = [
  {
    path: ':id',
    component: MemoSinglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoSinglePageRoutingModule {}
