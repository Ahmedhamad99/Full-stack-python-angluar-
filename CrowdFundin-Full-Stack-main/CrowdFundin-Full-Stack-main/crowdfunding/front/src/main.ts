import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './app/components/login/login.component';
import { ProjectsComponent } from './app/components/projects/projects.component';
import { RegisterComponent } from './app/components/register/register.component';
import { VerifyAccountComponent } from './app/components/verify-account/verify-account.component';
import { PasswordResetComponent } from './app/components/password-reset/password-reset.component';
import { ProjectDetailsComponent } from './app/components/project-details/project-details.component';
import { AddProjectComponent } from './app/components/add-project/add-project.component';
import { ProfileComponent } from './app/components/profile/profile.component';
import { EditProfileComponent } from './app/components/edit-profile/edit-profile.component';
import { DonationHistoryComponent } from './app/components/donation-history/donation-history.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'donation-history', component: DonationHistoryComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'add-project', component: AddProjectComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'project/:id', component: ProjectDetailsComponent },
      { path: 'verify-account', component: VerifyAccountComponent },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: '', redirectTo: '/projects', pathMatch: 'full' },
    ]),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
  ],
}).catch((err) => console.error(err));
