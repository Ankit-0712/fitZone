import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.getCurrentUserObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          // User is already logged in, redirect to home
          this.router.navigate(['/home']);
          return false;
        } else {
          // User is not logged in, allow access to login/signup
          return true;
        }
      })
    );
  }
} 