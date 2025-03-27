import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalCounts: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTotalCounts();
  }

  loadTotalCounts() {
    this.apiService.get<any[]>('/dashboard/totals')
      .then((response: any) => {
        this.totalCounts = response;
      })
      .catch((error: any) => {
        console.error('Error fetching categories:', error);
      });
  }
}
