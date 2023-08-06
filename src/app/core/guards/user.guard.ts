import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService, NavigationService } from '../services';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,

    // private notificationService: NotificationService,
    private authService: AuthService,
    private helper: JwtHelperService
  ) {}

  // TODO: initialize app
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;

    if (currentUser?.user?.role === 'USER') {
      const isRefreshTokenExpired = this.helper.isTokenExpired(
        currentUser.token.refreshToken
      );
      if (isRefreshTokenExpired) {
        this.authService.logout();
        return false;
      }

      // const isExpired = this.helper.isTokenExpired(currentUser.token.accessToken);
      // if (isExpired) {
      //   this.navigationService.loginPage();
      //   return false;
      // }

      return true;
    } else if (currentUser?.user?.role === 'ADMIN') {
      // this.notificationService.error(
      //   'You are not authorized to access this page'
      // );
      return false;
    }
    this.navigationService.loginPage();
    return false;
  }
}
