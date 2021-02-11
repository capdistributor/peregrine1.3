import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { VerifiedGuard } from './services/verified.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'instructions',
    loadChildren: () => import('./pages/instructions/instructions.module').then( m => m.InstructionsPageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'memo-list',
    loadChildren: () => import('./pages/memo-list/memo-list.module').then( m => m.MemoListPageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'memo-single',
    loadChildren: () => import('./pages/memo-single/memo-single.module').then( m => m.MemoSinglePageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'create-daily-log',
    loadChildren: () => import('./pages/create-daily-log/create-daily-log.module').then( m => m.CreateDailyLogPageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'edit-daily-log',
    loadChildren: () => import('./pages/edit-daily-log/edit-daily-log.module').then( m => m.EditDailyLogPageModule),
    canActivate: [AuthGuard, VerifiedGuard]
  },
  {
    path: 'create-memo',
    loadChildren: () => import('./pages/create-memo/create-memo.module').then( m => m.CreateMemoPageModule),
    canActivate: [AdminGuard, VerifiedGuard]
  },
  {
    path: 'unverified-user',
    loadChildren: () => import('./pages/unverified-user/unverified-user.module').then( m => m.UnverifiedUserPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
