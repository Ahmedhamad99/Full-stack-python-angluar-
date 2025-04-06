import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css'],
})
export class VerifyAccountComponent {
  username: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http
      .post('http://127.0.0.1:8000/api/verify-account/', {
        username: this.username,
      })
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = null;
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to verify account';
          this.message = null;
        },
      });
  }
}
