import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false; // Tracks login state
  public accessToken: undefined | string; // Stores JWT token

  constructor(private http: HttpClient) { }

  // Method to log in the user
  login(username: string, password: string) {
    return this.http.post<LoginResponse>('https://my-hr-api.onrender.com/auth/login', {"user_name": username,"password_hash": password})
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

export interface LoginResponse {
  token: string;
}
