import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log(`Username: ${this.username}, Password: ${this.password}`);

    // Simulate login (replace with real authentication logic)
    if (this.username && this.password) {
      this.authService.login(); // Set login state
      this.router.navigate(['/dashboard']); // Navigate to dashboard
    } else {
      alert('Invalid credentials');
    }
  }

  onSignIn() {    
    console.log('Signup');
  }
}
