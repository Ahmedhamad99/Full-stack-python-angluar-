import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AddProjectComponent {
  newProject = {
    title: '',
    details: '',
    total_target: 0,
    start_time: '',
    end_time: '',
  };
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private projectService: ProjectService, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

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
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        this.errorMessage =
          'Failed to create project: ' +
          (error.message || JSON.stringify(error));
        console.error('Error creating project:', error);
      },
    });
  }
}
