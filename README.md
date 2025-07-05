canMatch Guard

Till Angular 14 each route path given in the app-routing.module.ts had to be unique as we cannot give multiple routes with same path. But using canMatch we can route from one route path to one component say componentA and different route path can be given for the same component componentA using certain conditions and the conditions can be controlled by canMatch route guard.
Create 2 modules and routing files with the following commands

 ng g m user-home --routing
 ng g m admin-home --routing

Create 2 components for user-home and admin-home with the following commands

ng g c user-home/user-home --skip-tests

ng g c admin-home/admin-home --skip-tests

create 1 more component forgot 

ng g c forgot --skip-tests


In app-routing.module.ts gives the routes as follows


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotComponent } from './forgot/forgot.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./user-home/user-home.module').then(
        (user) => user.UserHomeModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./admin-home/admin-home.module').then(
        (admin) => admin.AdminHomeModule
      ),
  },
  { path: '**', component: ForgotComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}



In user-home-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [{ path: '', component: UserHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserHomeRoutingModule {}



In admin-home-routing.module.ts gives the routes like this


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';

const routes: Routes = [{ path: '', component: AdminHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminHomeRoutingModule {}


In app-routing.module.ts since we give UserHomeModule first in the 'const routes: Routes=[];' path as below when we hit 'https://localhost:4200/home' in the browser the first child with path home is UserHomeModule so UserHomeComponent module will load in this url ('https://localhost:4200/home' ).

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./user-home/user-home.module').then(
        (user) => user.UserHomeModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./admin-home/admin-home.module').then(
        (admin) => admin.AdminHomeModule
      ),
  },
  { path: '**', component: ForgotComponent },
];


But we can add a condition here where UserHomeModule will be loaded if the 'role' is user. and AdminHomeModule will be loaded if the role is admin. (as follows in app-routing.module.ts)

Type this command to create canMatch Guard 

ng g g rolemanager --skip-tests

and select canMatch


rolemanager.guard.ts

import { CanMatchFn } from '@angular/router';

export const rolemanagerGuard: CanMatchFn = (route, segments) => {
  var role = route.data?.['role'];
  console.log('bini', role, route);
  if (role === 'ADMIN') {
    return true;
  }
  return false;
};


Here if the role is ADMIN then canMatch guard (rolemanagerGuard) will return true otherwise returns false.

In the app-routing.module.ts

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
  },{
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



Note: var role = route.data?.['role']; will get role from app-routing.module.ts, from data. (eg:-  'data: { role: 'ADMIN' }')

example:-

{
    path: 'home',
    canMatch: [rolemanagerGuard],
    loadChildren: () =>
      import('./admin-home/admin-home.module').then(
        (admin) => admin.AdminHomeModule
      ),
    data: { role: 'ADMIN' },
  },

 Since 'canMatch: [rolemanagerGuard]'  is given for AdminHomeModule if the role we get from  'rolemanagerGuard' guard is true then AdminHomeModule will be triggered when we strike the url 'https://localhost:4200/home'. Otherwise if the same url  'https://localhost:4200/home' is typed without having canMatch value then its redirected to UserHomeModule.
If canMatch return true value then only AdminHomeComponent is loaded not UserHomeComponent in browser and viceversa.

const routes: Routes = [
   {
    path: 'home',
    canMatch: [rolemanagerGuard],
    loadChildren: () =>
      import('./admin-home/admin-home.module').then(
        (admin) => admin.AdminHomeModule
      ),
    data: { role: 'ADMIN' },
  },{
    path: 'home',
    loadChildren: () =>
      import('./user-home/user-home.module').then(
        (user) => user.UserHomeModule
      ),
  },
  { path: '**', component: ForgotComponent },
];


The component AdminHomeModule should be given in the start in the routes in app-routing.module.ts if there is 2 Modules with same path (here 'home'), then only canMatch will work .
