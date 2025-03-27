import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
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

  deleteCategory(cat: any): void {
    if (confirm('Jeste li sigurni da želite obrisati ovu kategoriju?')) {
      this.apiService.delete(`/categories/${cat.id}`)
        .then(response => {
          this.categories = this.categories.filter(c => c.id !== cat.id);
          this.toastr.success('Uspješno izbrisano!', 'Notifikacija');
        })
        .catch(error => {
          console.error('Greška pri brisanju kategorije:', error);
        });
    }
  }

  toggleActive(cat: any): void {
    const updatedCategory = { ...cat, active: !cat.active };
    console.log('Poslani podaci', updatedCategory);

    this.apiService.patch(`/categories/${cat.id}/status`, updatedCategory)
      .then(response => {
        cat.active = !cat.active;
        if (cat.active) {
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
