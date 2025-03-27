import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-subcategories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterLink],
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  subcategories: any[] = [];
  categories: any[] = [];
  selectedCategoryId: string | null = "";
  selectedActive: string | null = "";

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubcategories();
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
    let url = '/subcategories';
    if (this.selectedCategoryId !== null || this.selectedActive !== null) {
      url += '?';
      if (this.selectedCategoryId !== null) {
        url += `categoryId=${this.selectedCategoryId}&`;
      }
      if (this.selectedActive !== null) {
        url += `active=${this.selectedActive}`;
      }
    }

    this.apiService.get<any[]>(url)
      .then((response: any) => {
        this.subcategories = response;
      })
      .catch((error: any) => {
        console.error('Error fetching subcategories:', error);
      });
  }

  search(): void {
    this.loadSubcategories();
  }

  deleteSubcategory(sub: any): void {
    if (confirm('Jeste li sigurni da želite obrisati ovu potkategoriju?')) {
      this.apiService.delete(`/subcategories/${sub.id}`)
        .then(response => {
          this.subcategories = this.subcategories.filter(s => s.id !== sub.id);
          this.toastr.success('Uspješno izbrisano!', 'Notifikacija');
        })
        .catch(error => {
          console.error('Greška pri brisanju potkategorije:', error);
        });
    }
  }

  toggleActive(sub: any): void {
    const updatedSubcategory = { ...sub, active: !sub.active };

    this.apiService.patch(`/subcategories/${sub.id}/status`, updatedSubcategory)
      .then(response => {
        sub.active = !sub.active;
        if (sub.active) {
          this.toastr.success('Uspješno aktivirano!', 'Notifikacija');
        } else {
          this.toastr.success('Uspješno deaktivirano!', 'Notifikacija');
        }
      })
      .catch(error => {
        console.error('Greška pri ažuriranju statusa:', error);
      });
  }
}
