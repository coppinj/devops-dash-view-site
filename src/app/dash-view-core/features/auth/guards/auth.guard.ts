import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  canActivate() {
    return this.checkAuth();
  }

  canLoad() {
    return this.checkAuth();
  }

  canMatch() {
    return this.checkAuth();
  }

  checkAuth() {
    if (this.authService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
