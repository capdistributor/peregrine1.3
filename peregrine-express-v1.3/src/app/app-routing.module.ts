import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
  },
  {
    path: 'instructions',
    loadChildren: () => import('./pages/instructions/instructions.module').then( m => m.InstructionsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'memo-list',
    loadChildren: () => import('./pages/memo-list/memo-list.module').then( m => m.MemoListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'memo-single',
    loadChildren: () => import('./pages/memo-single/memo-single.module').then( m => m.MemoSinglePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-daily-log',
    loadChildren: () => import('./pages/create-daily-log/create-daily-log.module').then( m => m.CreateDailyLogPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-daily-log',
    loadChildren: () => import('./pages/edit-daily-log/edit-daily-log.module').then( m => m.EditDailyLogPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
