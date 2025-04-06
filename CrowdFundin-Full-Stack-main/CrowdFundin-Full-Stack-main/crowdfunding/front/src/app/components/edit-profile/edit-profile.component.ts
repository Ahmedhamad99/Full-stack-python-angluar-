import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
// import { ApiService } from '../../api-service/api-service.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  userImage = 'https://github.com/mdo.png';
  profileForm: FormGroup;
  errorMessage: string | null = null;
  backendErrors: { [key: string]: string[] } = {};
  user: User | any = null; // Add user property

  constructor(
    private fb: FormBuilder,
    private _ApiService: ApiService,
    private _Router: Router
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    });
  }

  ngOnInit() {
    // Fetch user data from localStorage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.profileForm.patchValue(this.user);
    } else {
      // Optionally fetch from API if not in localStorage
      this._ApiService.getUserProfile().subscribe({
        next: (userData) => {
          this.user = userData;
          localStorage.setItem('user', JSON.stringify(userData));
          this.profileForm.patchValue(userData);
        },
        error: (err) => console.error('Error fetching user profile:', err),
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      console.log('Form is invalid:', this.profileForm.errors);
      return;
    }

    const rawData = this.profileForm.getRawValue();
    const updateData = {
      first_name: rawData.first_name,
      last_name: rawData.last_name,
      email: rawData.email,
      mobile_phone: rawData.mobile_phone,
    };

    console.log('Submitting update with data:', updateData);

    this._ApiService.updateUserProfile(updateData).subscribe({
      next: (updatedData) => {
        this.user = updatedData;
        localStorage.setItem('user', JSON.stringify(updatedData));
        this._Router.navigate(['/profile']);
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        if (err.status === 400) {
          this.backendErrors = err.error;
          this.errorMessage = 'Please correct the errors below.';
          console.log('Validation errors:', this.backendErrors);
        } else if (err.status === 401) {
          this.errorMessage = 'Unauthorized: Please log in again.';
        } else {
          this.errorMessage = 'An error occurred while updating the profile.';
        }
      },
    });
  }

  // Optional: Keep updateProfile if you want to reuse it elsewhere
  updateProfile() {
    if (!this.user) {
      console.error('No user data available to update');
      return;
    }
    this.onSubmit(); // Delegate to onSubmit for consistency
  }

  // Getters
  get firstName() {
    return this.profileForm.get('first_name');
  }
  get lastName() {
    return this.profileForm.get('last_name');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get mobilePhone() {
    return this.profileForm.get('mobile_phone');
  }
}
