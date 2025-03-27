import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  fullName?: string;
  email?: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['login']);
    }
    document.body.classList.add('layout-fixed', 'sidebar-expand-lg', 'bg-body-tertiary');
    const user = this.authService.getCurrentUser();
    this.fullName = user.name;
    this.email = user.email;
  }

  ngOnDestroy(): void {
    document.body.classList.remove('layout-fixed', 'sidebar-expand-lg', 'bg-body-tertiary');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
