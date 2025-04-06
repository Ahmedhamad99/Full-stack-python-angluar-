import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://127.0.0.1:8000/api/projects/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    });
  }

  getProjects(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getProject(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders(),
    });
  }
  makeDonation(donationData: any): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.http.post(`${this.apiUrl}/donations/`, donationData, {
    //   headers,
    // });
    return of({ success: true });
  }
  // createProject(project: any): Observable<any> {
  //   return this.http.post(this.apiUrl, project, { headers: this.getHeaders() });
  // }

  createProject(projectData: FormData): Observable<any> {
    // Remove Content-Type header for FormData
    const headers = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('token')}`,
    });

    return this.http.post(this.apiUrl, projectData, { headers });
  }

  updateProject(id: number, projectData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('token')}`,
    });
    return this.http.patch(`${this.apiUrl}${id}/`, projectData, { headers });
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders(),
    });
  }
}
