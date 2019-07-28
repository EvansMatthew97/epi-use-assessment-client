import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './api/auth.guard';
import { ApiModule } from './api/api.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'editor',
    canActivate: [AuthGuard],
    loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ApiModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
