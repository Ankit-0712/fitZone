// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = getAuth(); // ✅ Initializes Firebase Auth instance
  }

  /**
   * Create a new user
   */
  signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sign in an existing user
   */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sign out the current user
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /**
   * Get the current user object
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
