import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './shared/navbar/navbar' // update path as needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Navbar],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class App {}
