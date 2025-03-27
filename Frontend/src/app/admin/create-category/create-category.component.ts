import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      ordinalNumber: [null, Validators.required],
      name: ['', Validators.required],
      color: ['#000000', Validators.required],
      active: [true]
    });
  }

  onSubmit(): void {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.valid) {
      const payload = this.categoryForm.value;

      this.apiService.post('/categories', payload)
        .then((response: any) => {
          this.router.navigate(['admin/categories']);
          this.toastr.success('Uspješno dodano!', 'Notifikacija');
        })
        .catch((error: any) => {
          this.errorMessage = 'Došlo je do greške prilikom kreiranja kategorije.';
          console.error('Error saving subcategory:', error);
        });
    } else {
      console.log('Forma nije validna!');
    }
  }
}
