import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = '';
  showMyProjectsOnly: boolean = false;
  newProject = {
    title: '',
    details: '',
    total_target: 0,
    start_time: '',
    end_time: '',
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProjects();
  }
  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (response) => {
        this.projects = response;
        this.filterProjects();
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load projects: ' + (error.message || 'Unknown error');
        console.error('Error loading projects:', error);
      },
    });
  }

  searchProjects() {
    this.filterProjects();
  }

  filterProjects() {
    let tempProjects = this.projects;

    if (this.searchTerm) {
      tempProjects = tempProjects.filter((project) =>
        project.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.showMyProjectsOnly) {
      const currentUserId = this.authService.getUserId();
      tempProjects = tempProjects.filter(
        (project) => project.user.id === Number(currentUserId)
      );
    }

    this.filteredProjects = tempProjects;
  }

  toggleMyProjects() {
    this.showMyProjectsOnly = !this.showMyProjectsOnly;
    this.filterProjects();
  }

  // onSubmit() {
  //   this.errorMessage = null;
  //   this.successMessage = null;

  //   this.newProject.start_time = new Date().toISOString();
  //   this.newProject.end_time = new Date(
  //     new Date().setDate(new Date().getDate() + 30)
  //   ).toISOString();

  //   this.projectService.createProject(this.newProject).subscribe({
  //     next: () => {
  //       this.successMessage = 'Project created successfully!';
  //       this.loadProjects();
  //       this.newProject = {
  //         title: '',
  //         details: '',
  //         total_target: 0,
  //         start_time: '',
  //         end_time: '',
  //       };
  //     },
  //     error: (error) => {
  //       this.errorMessage =
  //         'Failed to create project: ' +
  //         (error.message || JSON.stringify(error));
  //       console.error('Error creating project:', error);
  //     },
  //   });
  // }
  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    // Create FormData object to send both text and file data
    const formData = new FormData();
    formData.append('title', this.newProject.title);
    formData.append('details', this.newProject.details);
    formData.append('total_target', this.newProject.total_target.toString());
    formData.append('start_time', new Date().toISOString());
    formData.append(
      'end_time',
      new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
    );
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.projectService.createProject(formData).subscribe({
      next: () => {
        this.successMessage = 'Project created successfully!';
        this.loadProjects();
        this.newProject = {
          title: '',
          details: '',
          total_target: 0,
          start_time: '',
          end_time: '',
        };
        this.selectedFile = null; // Reset the file input
      },
      error: (error) => {
        this.errorMessage =
          'Failed to create project: ' +
          (error.message || JSON.stringify(error));
        console.error('Error creating project:', error);
      },
    });
  }

  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.successMessage = 'Project deleted successfully!';
          this.loadProjects();
        },
        error: (error) => {
          this.errorMessage =
            'Failed to delete project: ' + (error.message || 'Unknown error');
          console.error('Error deleting project:', error);
        },
      });
    }
  }

  getCardColor(index: number): string {
    const colors = [
      'bg-primary',
      'bg-success',
      // 'bg-warning',
      // 'bg-danger',
      'bg-info',
    ];
    return colors[index % colors.length];
  }
}
