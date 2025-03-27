import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-public-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  articles: any[] = [];
  categoryId?: number;
  subcategoryId?: number;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  category: any;
  subcategory: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;
    this.subcategoryId = +this.route.snapshot.paramMap.get('subcategoryId')!;
    this.route.params.subscribe(params => {
      this.categoryId = params["categoryId"];
      this.subcategoryId = params["subcategoryId"];
      this.loadArticles(this.categoryId, this.subcategoryId, this.currentPage);
      this.loadCategory(this.categoryId);
      this.loadSubcategory(this.subcategoryId);
    });
    this.loadArticles(this.categoryId, this.subcategoryId, this.currentPage);
    this.loadCategory(this.categoryId);
    this.loadSubcategory(this.subcategoryId);
  }

  loadCategory(categoryId: number | undefined): void {
    this.apiService.get(`/categories/${this.categoryId}`)
      .then((response: any) => {
        this.category = response;
      })
      .catch((error: any) => {
        console.error('Greška pri učitavanju kategorije:', error);
      });
  }

  loadSubcategory(subcategory: number | undefined): void {
    this.apiService.get<any>(`/subcategories/${this.subcategoryId}`)
      .then((response: any) => {
        this.subcategory = response;
      })
      .catch((error: any) => {
        console.error('Error fetching subcategory:', error);
      });
  }

  loadArticles(categoryId: number | undefined, subcategoryId: number | undefined, page: number): void {
    const params = {
      pageNumber: page,
      pageSize: this.pageSize,
      categoryId: categoryId,
      subcategoryId: subcategoryId
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
      this.loadArticles(this.categoryId, this.subcategoryId, page);
    }
  }
}
