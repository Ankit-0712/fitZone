import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./signup.scss'],
  templateUrl: './signup.html'
})
export class Signup {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  displayName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSignup() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signup(this.email, this.password);
      console.log('Signup successful!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Signup error:', error);
      this.handleSignupError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.email || !this.password || !this.confirmPassword || !this.displayName) {
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

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.displayName.length < 2) {
      this.errorMessage = 'Display name must be at least 2 characters long';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleSignupError(error: any) {
    console.log('Handling signup error:', error);
    console.log('Error code:', error.code);
    
    if (error.code === 'auth/email-already-in-use') {
      this.errorMessage = 'An account with this email already exists';
      console.log('Setting error message:', this.errorMessage);
    } else if (error.code === 'auth/invalid-email') {
      this.errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      this.errorMessage = 'Password is too weak. Please choose a stronger password';
    } else if (error.code === 'auth/operation-not-allowed') {
      this.errorMessage = 'Email/password accounts are not enabled';
    } else {
      this.errorMessage = 'Signup failed. Please try again';
    }
    
    console.log('Final error message:', this.errorMessage);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearError() {
    this.errorMessage = '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  checkPasswordStrength(): string {
    if (!this.password) return '';
    
    const hasLower = /[a-z]/.test(this.password);
    const hasUpper = /[A-Z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    const isLongEnough = this.password.length >= 8;

    const strength = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    if (strength <= 4) return 'strong';
    return 'very-strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.checkPasswordStrength();
    switch (strength) {
      case 'weak': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'strong': return '#10b981';
      case 'very-strong': return '#059669';
      default: return '#6b7280';
    }
  }
}
