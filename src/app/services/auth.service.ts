// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Auth as FirebaseAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: FirebaseAuth) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
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

  /**
   * Get current user as observable
   */
  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }
}
