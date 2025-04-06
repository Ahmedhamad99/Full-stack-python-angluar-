import { Component } from '@angular/core';
import { ProjectService } from '../../servise/apiproduct.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detalis',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './project-detalis.component.html',
  styleUrl: './project-detalis.component.css'
})
export class ProjectDetalisComponent {




  project: any;
  milestones: any[] = [];
  isDeleting = false;
  isCreator = false;
  progressPercentage = 0;
  isActive = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
      this.loadMilestones(id);
    }
  }

  loadProject(id: string): void {
    this.projectService.getProject(+id).subscribe({
      next: (data) => {
        this.project = data;
        this.calculateProgress();
        this.checkProjectStatus();
      },
      error: (err) => console.error('Failed to load project', err)
    });
  }

  loadMilestones(id: string): void {
    this.projectService.getProject(+id).subscribe({
      next: (data) => this.milestones = data,
      error: (err) => console.error('Failed to load milestones', err)
    });
  }

  calculateProgress(): void {
    if (this.project?.total_target && this.project?.current_funding) {
      this.progressPercentage = (this.project.current_funding / this.project.total_target) * 100;
    }
  }

  checkProjectStatus(): void {
    if (this.project?.end_time) {
      const endDate = new Date(this.project.end_time);
      this.isActive = endDate > new Date();
    }
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project permanently?')) {
      this.isDeleting = true;
      this.projectService.deleteProject(this.project.id).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => {
          console.error('Delete failed', err);
          this.isDeleting = false;
        }
      });
    }
  }
}