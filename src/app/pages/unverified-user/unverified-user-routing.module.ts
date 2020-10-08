import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnverifiedUserPage } from './unverified-user.page';

const routes: Routes = [
  {
    path: '',
    component: UnverifiedUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnverifiedUserPageRoutingModule {}
