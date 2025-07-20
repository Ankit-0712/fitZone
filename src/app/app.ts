import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Navbar, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class App {
  constructor(private router: Router) {}
}
