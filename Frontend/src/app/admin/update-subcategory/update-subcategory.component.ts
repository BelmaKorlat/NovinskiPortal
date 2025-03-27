import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './update-subcategory.component.html',
  styleUrls: ['./update-subcategory.component.css']
})
export class UpdateSubcategoryComponent implements OnInit {
  subcategoryForm: FormGroup;
  categories: any[] = [];
  errorMessage: string | null = null;
  subcategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
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

    this.subcategoryId = +this.route.snapshot.paramMap.get('id')!;

    if (this.subcategoryId) {
      this.loadSubcategory(this.subcategoryId);
    }
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

  loadSubcategory(id: number): void {
    this.apiService.get<any>(`/subcategories/${id}`)
      .then((response: any) => {
        this.subcategoryForm.patchValue(response);
      })
      .catch((error: any) => {
        console.error('Error fetching subcategory:', error);
      });
  }

  onSubmit(): void {
    this.subcategoryForm.markAllAsTouched();
    if (this.subcategoryForm.valid) {
      const payload = this.subcategoryForm.value;

      this.apiService.put(`/subcategories/${this.subcategoryId}`, payload)
        .then((response: any) => {
          this.router.navigate(['admin/subcategories']);
          this.toastr.success('Uspješno ažurirano!', 'Notifikacija');
        })
        .catch((error: any) => {
          this.errorMessage = 'Došlo je do greške prilikom ažuriranja potkategorije.';
          console.error('Error updating subcategory:', error);
        });
    } else {
      this.errorMessage = 'Molimo popunite sva obavezna polja.';
      console.log('Forma nije validna!');
    }
  }
}
