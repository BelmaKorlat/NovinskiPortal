import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-articles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterLink],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  subcategories: any[] = [];
  categories: any[] = [];
  users: any[] = [];
  query: any;
  selectedCategoryId: string | null = "";
  selectedSubcategoryId: string | null = "";
  selectedUserId: string | null = "";

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadArticles(this.currentPage);
    this.loadCategories();
    this.loadSubcategories();
    this.loadUsers();
  }

  loadCategories(): void {
    this.apiService.get<any[]>('/categories')
      .then((response: any) => {
        this.categories = response;
      })
      .catch((error: any) => {
        console.error('Error fetching categories:', error);
      });
  }

  loadSubcategories(): void {
    this.apiService.get<any[]>('/subcategories')
      .then((response: any) => {
        this.subcategories = response;
      })
      .catch((error: any) => {
        console.error('Error fetching subcategories:', error);
      });
  }

  loadUsers(): void {
    this.apiService.get<any[]>('/user')
      .then((response: any) => {
        this.users = response;
      })
      .catch((error: any) => {
        console.error('Error fetching users:', error);
      });
  }

  loadArticles(page: number): void {
    const params = {
      pageNumber: page,
      pageSize: this.pageSize,
      categoryId: this.selectedCategoryId,
      subcategoryId: this.selectedSubcategoryId,
      query: this.query,
      userId: this.selectedUserId
    };

    this.apiService.get<any[]>('/articles', { params })
      .then((response: any) => {
        this.articles = response.items;
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
        this.currentPage = page;
      })
      .catch((error: any) => {
        console.error('Error fetching articles:', error);
      });
  }

  deleteCategory(art: any): void {
    if (confirm('Jeste li sigurni da želite obrisati ovaj članak?')) {
      this.apiService.delete(`/articles/${art.id}`)
        .then(response => {
          this.articles = this.articles.filter(a => a.id !== art.id);
          this.toastr.success('Uspješno izbrisano!', 'Notifikacija');
        })
        .catch(error => {
          console.error('Greška pri brisanju članka:', error);
        });
    }
  }

  toggleActive(art: any): void {
    const updatedArticle = { ...art, active: !art.active };
    console.log('Poslani podaci', updatedArticle);

    this.apiService.patch(`/articles/${art.id}`, updatedArticle)
      .then(response => {
        art.active = !art.active;
        if (art.active) {
          this.toastr.success('Uspješno aktivirano!', 'Notifikacija');
        } else {
          this.toastr.success('Uspješno deaktivirano!', 'Notifikacija');
        }
      })
      .catch(error => {
        console.error('Greška pri ažuriranju statusa:', error);
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
      this.loadArticles(page);
    }
  }
}
