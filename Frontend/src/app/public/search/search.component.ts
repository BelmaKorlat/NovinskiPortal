import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  articles: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  searchTerm?: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.searchTerm = this.route.snapshot.queryParamMap.get('term')!;
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params["term"];
      this.loadArticles(this.searchTerm, this.currentPage);
    });
    this.loadArticles(this.searchTerm,  this.currentPage);
  }

  loadArticles(searchTerm: string | undefined, page: number): void {
    const params = {
      pageNumber: page,
      pageSize: this.pageSize,
      query: searchTerm
    };

    this.apiService.get<any[]>('/articles', { params })
      .then((response: any) => {
        this.articles = response.items;
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
        this.currentPage = page;
      })
      .catch((error: any) => {
        console.error('Error fetching categories:', error);
      });
  }


  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadArticles(this.searchTerm, page);
    }
  }
}
