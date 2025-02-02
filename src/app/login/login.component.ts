import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false; // New property for loading state

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
      this.loading = true; // Start loading spinner
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          this.authService.accessToken = response.access_token;
          this.authService.refreshToken = response.refresh_token;
          this.authService.username = response.username;
          this.authService.isLoggedIn = true;
          this.loading = false; // Stop loading spinner
          this.router.navigate(['/dashboard']); // Navigate to dashboard
        },
        (error) => {
          if (error.status === 401){
            // console.error('Login failed:', error.message);\
            this.password = ''; // Clear password field
            this.loading = false; // Stop loading spinner
            alert(error.error.message);
          } else {
            console.error('Something went wrong:', error.message);
            this.password = ''; // Clear password field
            this.username = ''; // Clear username field
            this.loading = false; // Stop loading spinner
            if (error.error.message) {
              alert(error.error.message);
            } else {
              alert('Something went wrong. Please try again later.');
            } 
          }
        }
      );
  }

  onSignIn() {
    console.log('Continue with google');
  }

  onSingUp() {
    this.router.navigate(['/signup']);
  }
}
