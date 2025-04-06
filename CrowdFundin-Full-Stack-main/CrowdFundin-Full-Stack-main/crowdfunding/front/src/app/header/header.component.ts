import { Component } from '@angular/core';
import { Router,RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
AuthService
// import
@Component({
  selector: 'app-header',
  imports:[RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userImage = 'https://github.com/mdo.png';
  
  constructor(public authService: AuthService, private router: Router) {}

    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    
}
