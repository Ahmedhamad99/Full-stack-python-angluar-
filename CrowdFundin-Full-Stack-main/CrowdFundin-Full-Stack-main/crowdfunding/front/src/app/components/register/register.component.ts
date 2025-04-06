import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  first_name: string = '';
  last_name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  mobile_phone: string = '';
  error: string | null = null;
  success: string | null = null;
  isSubmitting: boolean = false; // Added to track submission state

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Clear previous messages
    this.error = null;
    this.success = null;

    // Check if form is already submitting
    if (this.isSubmitting) {
      return;
    }

    // Validate password match
    if (this.password !== this.confirm_password) {
      this.error = "Passwords don't match";
      return;
    }

    // Basic client-side validation
    if (!this.first_name || !this.last_name || !this.username || !this.email || 
        !this.password || !this.mobile_phone) {
      this.error = "Please fill in all required fields";
      return;
    }

    // Validate Egyptian mobile phone format
    const phonePattern = /^01[0125][0-9]{8}$/;
    if (!phonePattern.test(this.mobile_phone)) {
      this.error = "Please enter a valid Egyptian mobile number (11 digits starting with 010, 011, 012, or 015)";
      return;
    }

    const userData = {
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
      password: this.password,
      mobile_phone: this.mobile_phone,
      is_admin: false,
    };

    this.isSubmitting = true;

    this.http.post('http://127.0.0.1:8000/api/register/', userData).subscribe({
      next: (response: any) => {
        this.success = 'Registration successful! Please verify your account.';
        this.isSubmitting = false;
        
        
        this.resetForm();
        
        
        setTimeout(() => {
          this.router.navigate(['/verify-account']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.error?.message || 
                    error.error?.email?.[0] || 
                    error.error?.username?.[0] || 
                    'Registration failed. Please try again.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

 
  private resetForm() {
    this.first_name = '';
    this.last_name = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirm_password = '';
    this.mobile_phone = '';
  }
}