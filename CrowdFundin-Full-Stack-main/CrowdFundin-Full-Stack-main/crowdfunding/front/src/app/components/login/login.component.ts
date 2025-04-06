import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private formBilder = new FormBuilder();
  errorMessage : string | null =null;
  constructor(private _Api_Service:ApiService,private _Router:Router){}

  loginForm = this.formBilder.group({
    username:['',[Validators.required]],
    password:['',Validators.required]
  })

  get username(){
    return this.loginForm.get('username')
  }
  get password(){
    return this.loginForm.get('password')
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.value as { username: string; password: string };
    // login.component.ts
      this._Api_Service.login(username, password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('user_id', JSON.stringify(response.user.id));
          localStorage.setItem('isAdmin', JSON.stringify(response.user.is_admin));
          this._Router.navigate(['/projects']);
        }
      });

  }


}




// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   errorMessage: string | null = null;

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit() {
//     this.errorMessage = null;
//     this.authService.login(this.username, this.password).subscribe({
//       next: (response) => {
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('user', JSON.stringify(response.user));
//         localStorage.setItem('user_id', JSON.stringify(response.user.id));
//         this.router.navigate(['/projects']);
//       },
//       error: (error) => {
//         this.errorMessage = 'Invalid credentials';
//         console.error('Login error:', error);
//       },
//     });
//   }
// }
