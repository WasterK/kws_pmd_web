import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false; // Tracks login state

  constructor() { }

  // Method to log in the user
  login() {
    this.isLoggedIn = true;
    console.log('User logged in');
  }

  // Method to log out the user
  logout() {
    this.isLoggedIn = false;
    console.log('User logged out');
  }

  // Method to check login status
  getLoginStatus() {
    return this.isLoggedIn;
  }
}
