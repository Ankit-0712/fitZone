import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Categories } from './pages/workouts/categories/categories';
import { ExerciseList } from './pages/workouts/exercise-list/exercise-list';
import { PlanBuilder } from './pages/workouts/plan-builder/plan-builder';
import { Tracker } from './pages/progress/tracker/tracker';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'categories', component: Categories },
  { path: 'exercises', component: ExerciseList },
  { path: 'plan-builder', component: PlanBuilder },
  { path: 'tracker', component: Tracker },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
