import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.getCurrentUserObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          // User is logged in, allow access
          return true;
        } else {
          // User is not logged in, redirect to login
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
} 