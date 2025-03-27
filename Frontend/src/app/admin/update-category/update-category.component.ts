import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  errorMessage: string = '';
  categoryId!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Category ID:', this.categoryId);

    this.categoryForm = this.fb.group({
      ordinalNumber: [null, Validators.required],
      name: ['', Validators.required],
      color: ['#000000', Validators.required],
      active: [true]
    });

    this.loadCategory();
  }

  loadCategory(): void {
    this.apiService.get(`/categories/${this.categoryId}`)
      .then((response: any) => {
        console.log('Podaci kategorije:', response);
        this.categoryForm.patchValue(response);
      })
      .catch((error: any) => {
        console.error('Greška pri učitavanju kategorije:', error);
        this.errorMessage = 'Došlo je do greške pri učitavanju kategorije.';
      });
  }

  onSubmit(): void {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.valid) {
      const payload = this.categoryForm.value;

      this.apiService.put(`/categories/${this.categoryId}`, payload)
        .then((response: any) => {
          this.router.navigate(['admin/categories']);
          this.toastr.success('Uspješno ažurirano!', 'Notifikacija');
        })
        .catch((error: any) => {
          console.error('Greška prilikom ažuriranja kategorije:', error);
          this.errorMessage = 'Došlo je do greške prilikom ažuriranja kategorije.';
        });
    } else {
      console.log('Forma nije validna!');
    }
  }
}