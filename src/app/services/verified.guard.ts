import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUserProfile$
      .pipe(
        map(user => {
          if (environment.production === false) {
            return true;
          }
          if (user.isVerified) {
            return true;
          } else {
            this.router.navigateByUrl('/unverified-user');
            console.log("user is NOT verified");
            return false;
          }
        }),
      );
  }
  
  constructor(private authService: AuthService, private router: Router) {}
}