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
  username: string = 'DemoUser';
  password: string = 'Demo@123';
  loading: boolean = false; // New property for loading state

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username !== "DemoUser" && this.password !== "Demo@123") {
      this.loading = true; // Start loading spinner
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          this.authService.accessToken = response.token;
          this.authService.isLoggedIn = true;
          this.loading = false; // Stop loading spinner
          this.router.navigate(['/dashboard']); // Navigate to dashboard
        },
        (error) => {
          console.error('Login failed:', error);
          this.loading = false; // Stop loading spinner
          alert('Invalid credentials');
        }
      );
    } else {
        this.authService.isLoggedIn = true;
        this.loading = false; // Stop loading spinner
        this.router.navigate(['/dashboard']); // Navigate to dashboard
    }
  }

  onSignIn() {
    console.log('Continue with google');
  }

  onSingUp() {
    this.router.navigate(['/signup']);
  }
}
