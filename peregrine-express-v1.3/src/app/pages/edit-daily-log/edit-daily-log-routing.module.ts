import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDailyLogPage } from './edit-daily-log.page';

const routes: Routes = [
  {
    path: ':logId',
    component: EditDailyLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDailyLogPageRoutingModule {}
