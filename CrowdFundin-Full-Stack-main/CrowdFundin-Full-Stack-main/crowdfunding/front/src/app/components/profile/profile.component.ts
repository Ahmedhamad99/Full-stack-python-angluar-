import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { ApiService } from '../../api-service/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }

    this.apiService.getUserProfile().subscribe({
      next: (userData) => {
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.user = null; // Reset user on error
      },
    });
  }
}
