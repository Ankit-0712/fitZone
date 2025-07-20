import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.email, this.password);
      console.log('Login successful!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.handleLoginError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleLoginError(error: any) {
    if (error.code === 'auth/user-not-found') {
      this.errorMessage = 'No account found with this email address';
    } else if (error.code === 'auth/wrong-password') {
      this.errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      this.errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/too-many-requests') {
      this.errorMessage = 'Too many failed attempts. Please try again later';
    } else {
      this.errorMessage = 'Login failed. Please try again';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.errorMessage = '';
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
