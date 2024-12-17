import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false; 
  private authUrl = environment.authUrl
  public accessToken: undefined | string; 

  constructor(private http: HttpClient) { }

  // Method to log in the user
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, {"user_name": username,"password_hash": password})
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

  signup(data: any) {
    return this.http.post(`${this.authUrl}/signup`, {
      "user_name": data.user_name,
      "password_hash": data.password,
      "email": data.email,
      "first_name": data.first_name,
      "last_name": data.last_name,
      "created_by": data.created_by,
      "employee_id": data.employee_id,
      "mobile_number": data.mobile_number
    });
  }
}

export interface LoginResponse {
  token: string;
}
