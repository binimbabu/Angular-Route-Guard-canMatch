import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotComponent } from './forgot/forgot.component';
import { rolemanagerGuard } from './rolemanager.guard';

const routes: Routes = [
  {
    path: 'home',
    canMatch: [rolemanagerGuard],
    loadChildren: () =>
      import('./admin-home/admin-home.module').then(
        (admin) => admin.AdminHomeModule
      ),
    data: { role: 'ADMIN' },
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./user-home/user-home.module').then(
        (user) => user.UserHomeModule
      ),
  },
  { path: '**', component: ForgotComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
