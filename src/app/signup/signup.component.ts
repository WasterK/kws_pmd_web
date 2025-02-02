import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
})
export class SignupComponent {
  user_name: string = '';
  password: string = '';
  confirm_password: string = ''; // New field for Confirm Password
  email: string = '';
  first_name: string = '';
  last_name: string = '';
  created_by: string = 'self';
  employee_id: string = '';
  date_of_birth: Date = new Date();
  mobile_number: number | null = 0;
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  // Handle form submission
  onSubmit() {
    // Check if all fields are filled out
    if (
      !this.user_name ||
      !this.password ||
      !this.confirm_password || 
      !this.email ||
      !this.first_name ||
      !this.last_name ||
      !this.created_by 
    ) {
      alert('Please fill out all fields.');
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirm_password) {
      alert('Passwords do not match.');
      return;
    }

    this.loading = true;

    this.authService.signup({
      user_name: this.user_name,
      password: this.password,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      // date format: YYYY-MM-DD  
      date_of_birth: this.date_of_birth.toISOString().split('T')[0],
      phone_number: this.mobile_number,
      created_by: this.created_by,
      employee_id: this.employee_id,
      mobile_number: this.mobile_number,
    }).subscribe(
      (response: any) => {
        console.log(response);
        this.router.navigate(['/login']);
        // Reset form
        this.user_name = '';
        this.password = '';
        this.confirm_password = ''; 
        this.email = '';
        this.first_name = '';
        this.last_name = '';
        this.employee_id = '';
        this.mobile_number = null;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        if (error.status == 409) {
          this.loading = false;
          alert(error.error.message);
        } else if (error.status == 400) {
          this.loading = false;
          alert(`Signup failed. ${error.error.message}`);
        } else {
          this.loading = false;
          alert('Signup failed. Please try again later.');
        }
      });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
