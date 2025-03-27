import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  articles: any[] = [];

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    const params = {
      pageNumber: 1,
      pageSize: 9
    };

    this.apiService.get<any[]>('/articles', { params })
      .then((response: any) => {
        this.articles = response.items;
      })
      .catch((error: any) => {
        console.error('Error fetching categories:', error);
      });
  }
}
