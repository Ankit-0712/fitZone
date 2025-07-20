import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userEmail = '';
  userName = '';
  isProfileDropdownOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkScroll();
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.isLoggedIn = !!user;
      this.userEmail = user?.email || '';
      this.userName = user?.displayName || this.getDisplayNameFromEmail(user?.email || '');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // Close mobile menu on window resize
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close profile dropdown when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown') && !target.closest('.profile-toggle')) {
      this.isProfileDropdownOpen = false;
    }
  }

  checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Only disable body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('menu-open');
  }

  toggleProfileDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown() {
    this.isProfileDropdownOpen = false;
  }

  navigateToLogin() {
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.closeMobileMenu();
    this.router.navigate(['/signup']);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.closeMobileMenu();
      this.closeProfileDropdown();
      this.router.navigate(['/home']);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Close mobile menu when clicking on a nav link
  onNavLinkClick() {
    this.closeMobileMenu();
  }

  // Get display name from email (fallback)
  private getDisplayNameFromEmail(email: string): string {
    if (!email) return 'User';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
