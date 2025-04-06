import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent {
  email: string = '';
  newPassword: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http
      .post('http://127.0.0.1:8000/api/password-reset/', {
        email: this.email,
        new_password: this.newPassword,
      })
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = null;
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to reset password';
          this.message = null;
        },
      });
  }
}
