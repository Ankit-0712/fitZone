import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Categories } from './pages/workouts/categories/categories';
import { ExerciseList } from './pages/workouts/exercise-list/exercise-list';
import { PlanBuilder } from './pages/workouts/plan-builder/plan-builder';
import { Tracker } from './pages/progress/tracker/tracker';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login, canActivate: [GuestGuard] },
  { path: 'signup', component: Signup, canActivate: [GuestGuard] },
  { path: 'categories', component: Categories, canActivate: [AuthGuard] },
  { path: 'exercises', component: ExerciseList, canActivate: [AuthGuard] },
  { path: 'plan-builder', component: PlanBuilder, canActivate: [AuthGuard] },
  { path: 'tracker', component: Tracker, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
