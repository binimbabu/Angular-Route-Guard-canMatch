import { CanMatchFn } from '@angular/router';

export const rolemanagerGuard: CanMatchFn = (route, segments) => {
  var role = route.data?.['role'];
  if (role === 'ADMIN') {
    return true;
  }
  return false;
};
