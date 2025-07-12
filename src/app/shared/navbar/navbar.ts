import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  navigateToLogin() {
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.closeMobileMenu();
    this.router.navigate(['/signup']);
  }

  // Close mobile menu when clicking on a nav link
  onNavLinkClick() {
    this.closeMobileMenu();
  }
}
