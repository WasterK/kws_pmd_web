import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false; 
  private authUrl = environment.authUrl
  public accessToken: undefined | string; 
  public refreshToken: undefined | string;
  public username: undefined | string;
  public userId: undefined | string;

  constructor(private http: HttpClient) { }

  // Method to log in the user
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, { username, password }, {
      withCredentials: true, // Ensure cookies are included in the request
    });
  }

  tokenRefresh() {
    return this.http.post<LoginResponse>(`${this.authUrl}/refresh`, {}, {
      withCredentials: true, // Ensure cookies are included in the request  
    });
  }

  getTokenExpirationDate(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/token-expiration`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 && error.error?.error === 'token_expired') {
      console.log('Token has expired. Redirecting to login...');
      // Handle token expiration (e.g., redirect to login, refresh token, etc.)
    }
    return throwError(() => error);
  }

  // Method to log out the user
  logout() { 
    return this.http.post(`${this.authUrl}/logout`, {}, {withCredentials: true})
  }

  // Method to check login status
  getLoginStatus() {
    return this.isLoggedIn;
  }

  signup(data: any) {
    return this.http.post(`${this.authUrl}/register`, {
      "username": data.user_name,
      "password": data.password,
      "first_name": data.first_name,
      "last_name": data.last_name,
      "phone_number": data.phone_number,
      "date_of_birth": data.date_of_birth,
      "email": data.email,
    });
  }
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  username: string;
}
