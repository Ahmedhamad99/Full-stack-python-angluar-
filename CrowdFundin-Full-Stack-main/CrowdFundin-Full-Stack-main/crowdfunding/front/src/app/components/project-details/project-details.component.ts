import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ProjectDetailsComponent implements OnInit {
  project: any = null;
  isEditing: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;
  isAdmin: boolean = false;
  donationAmount: number = 0; //added

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = Number(this.authService.getUserId());
    this.isAdmin = this.authService.isAdmin();

    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(+projectId);
    } else {
      this.errorMessage = 'Project ID not found';
    }
  }

  loadProject(id: number) {
    this.projectService.getProject(id).subscribe({
      next: (response) => {
        this.project = response;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load project: ' + (error.message || 'Unknown error');
        console.error('Error loading project:', error);
      },
    });
  }

  donate() {
    //added
    if (this.donationAmount > 0) {
      this.projectService
        .makeDonation({
          projectId: this.project.id,
          amount: this.donationAmount,
        })
        .subscribe({
          next: () => {
            alert('Donation successful!');
            this.donationAmount = 0;
            this.loadProject(this.project.id.toString());
          },
          error: (error) => {
            console.error('Donation error:', error);
            alert('Donation failed.');
          },
        });
    } else {
      alert('Please enter a valid donation amount.');
    }
  }

  canEdit(): boolean {
    return (
      this.isAdmin ||
      (this.project &&
        this.project.user &&
        this.project.user.id === this.currentUserId)
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (!this.project) return;

    this.errorMessage = null;
    this.successMessage = null;

    const formData = new FormData();
    formData.append('title', this.project.title || ''); // Required
    formData.append('details', this.project.details || ''); // Required
    formData.append(
      'total_target',
      this.project.total_target.toString() || '0'
    ); // Required,
    formData.append('start_time', this.project.start_time || ''); // Required,
    formData.append('end_time', this.project.end_time || '');

    if (this.project.image instanceof File) {
      formData.append('image', this.project.image);
    }

    console.log('Sending FormData:', formData); // For debugging

    this.projectService.updateProject(this.project.id, formData).subscribe({
      next: () => {
        this.successMessage = 'Project updated successfully!';
        this.isEditing = false;
        this.loadProject(this.project.id);
      },
      error: (error) => {
        this.errorMessage =
          'Failed to update project: ' +
          (error.error ? JSON.stringify(error.error) : error.message);
        console.error('Error updating project:', error);
      },
    });
  }
}
