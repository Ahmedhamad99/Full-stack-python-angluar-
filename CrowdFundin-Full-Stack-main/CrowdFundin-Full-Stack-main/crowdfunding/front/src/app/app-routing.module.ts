import { Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
AddProjectComponent

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:id', component: ProjectDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: '**', redirectTo: '/projects' },
];
