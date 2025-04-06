import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;

  }): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, userData);
  }


  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isAdmin', response.is_admin.toString());
          localStorage.setItem('userId', response.user_id.toString());
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
