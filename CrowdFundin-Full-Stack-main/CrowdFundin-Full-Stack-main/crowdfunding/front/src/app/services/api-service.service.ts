import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

import { tap } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    });
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}projects/`, {
      headers: this.getHeaders(),
    });
  }

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}login/`, {
      username,
      password,
    });
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}profile/`, {
      headers: this.getHeaders(),
    });
  }
  updateUserProfile(updatedUser: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}profile/`, updatedUser, {
      headers: this.getHeaders(),
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }
}
