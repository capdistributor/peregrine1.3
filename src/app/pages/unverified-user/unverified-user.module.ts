import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnverifiedUserPageRoutingModule } from './unverified-user-routing.module';

import { UnverifiedUserPage } from './unverified-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnverifiedUserPageRoutingModule
  ],
  declarations: [UnverifiedUserPage]
})
export class UnverifiedUserPageModule {}
