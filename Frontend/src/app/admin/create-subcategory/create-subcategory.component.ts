import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './create-subcategory.component.html',
  styleUrls: ['./create-subcategory.component.css']
})
export class CreateSubcategoryComponent implements OnInit {
  subcategoryForm: FormGroup;
  categories: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.subcategoryForm = this.fb.group({
      categoryId: ['', Validators.required],
      ordinalNumber: ['', Validators.required],
      name: ['', Validators.required],
      active: [true]
    });
  }

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

  onSubmit(): void {
    this.subcategoryForm.markAllAsTouched();
    if (this.subcategoryForm.valid) {
      const payload = this.subcategoryForm.value;

      this.apiService.post('/subcategories', payload)
        .then((response: any) => {
          this.router.navigate(['admin/subcategories']);
          this.toastr.success('Uspješno dodano!', 'Notifikacija');
        })
        .catch((error: any) => {
          this.errorMessage = 'Došlo je do greške prilikom čuvanja potkategorije.';
          console.error('Error saving subcategory:', error);
        });
    } else {
      this.errorMessage = 'Molimo popunite sva obavezna polja.';
      console.log('Forma nije validna!');
    }
  }

}
