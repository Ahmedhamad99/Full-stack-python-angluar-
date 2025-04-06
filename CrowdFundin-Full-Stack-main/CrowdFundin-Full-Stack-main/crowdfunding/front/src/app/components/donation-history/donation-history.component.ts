import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  ActivatedRoute,
} from '@angular/router';
// import { ApiService } from '../../api-service/api-service.service';
import { Projects } from '../../models/projects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './donation-history.component.html',
  styleUrls: ['./donation-history.component.css'],
})
export class DonationHistoryComponent implements OnInit {
  projects: Projects[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;
  filteredProjects: Projects[] = [];
  searchTerm: string = '';
  showMyProjectsOnly: boolean = false;
  user: User | null = null;

  constructor(private _Api_Service: ApiService, private _Router: Router) {}

  ngOnInit() {
    if (!this._Api_Service.isLoggedIn()) {
      this._Router.navigate(['/login']);
      return;
    }
    this.currentUserId = Number(this._Api_Service.getUserId());
    this.loadProjects();
  }

  isAdmin(): boolean {
    return this._Api_Service.isAdmin();
  }

  loadProjects() {
    this._Api_Service.getProjects().subscribe({
      next: (response) => {
        this.projects = response;
        console.log('user project', this.projects);
        this.filterProjects();
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load projects: ' + (error.message || 'Unknown error');
        console.error('Error loading projects:', error);
      },
    });
  }

  filterProjects() {
    if (!this.currentUserId) return;

    this.filteredProjects = this.projects.filter(
      (project) => project.user?.id === this.currentUserId
    );
    console.log('user project', this.filteredProjects);
  }
}
