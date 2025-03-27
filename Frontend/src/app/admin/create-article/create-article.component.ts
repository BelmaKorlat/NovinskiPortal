import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, NgxEditorModule } from 'ngx-editor';
import flatpickr from 'flatpickr';
import { format } from 'date-fns';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxEditorModule, RouterLink],
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  editor!: Editor;
  articleForm!: FormGroup;
  errorMessage: string = '';
  categories: any[] = [];
  subcategories: any[] = [];
  previewMain: string | null = null;
  previewGallery: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.articleForm = this.fb.group({
      headline: ['', Validators.required],
      subheadline: ['', Validators.required],
      shortText: ['', Validators.required],
      text: ['', Validators.required],
      active: [true],
      hideFullName: [true],
      breakingNews: [false],
      live: [false],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
      publishedAt: [format(new Date(), 'dd.MM.yyyy HH:mm'), Validators.required],
      mainPhoto: [null, Validators.required],
      additionalPhotos: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.editor = new Editor();

    this.articleForm.get('categoryId')?.valueChanges.subscribe((catId) => {
      this.loadSubcategories(catId);
    });

    flatpickr('#publishedAt', {
      enableTime: true,
      dateFormat: 'd.m.Y H:i',
      defaultDate: new Date()
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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

  loadSubcategories(categoryId: number | undefined): void {
    if (!categoryId) {
      this.subcategories = [];
      return;
    }
    this.apiService.get<any[]>('/subcategories', { params: { categoryId: categoryId } })
      .then((response: any) => {
        this.subcategories = response;
      })
      .catch((error: any) => {
        console.error('Error fetching subcategories:', error);
      });
  }

  onMainPhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.articleForm.patchValue({ mainPhoto: file });
      const reader = new FileReader();
      reader.onload = () => (this.previewMain = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onGalleryChange(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.articleForm.patchValue({ additionalPhotos: files });
    console.log(this.articleForm.value);
    this.previewGallery = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewGallery.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    this.articleForm.markAllAsTouched();
    if (this.articleForm.valid) {
      const formData = new FormData();

      formData.append("Headline", this.articleForm.value.headline);
      formData.append("Subheadline", this.articleForm.value.subheadline);
      formData.append("ShortText", this.articleForm.value.shortText);
      formData.append("Text", this.articleForm.value.text);
      formData.append("Active", this.articleForm.value.active);
      formData.append("HideFullName", this.articleForm.value.hideFullName);
      formData.append("BreakingNews", this.articleForm.value.breakingNews);
      formData.append("Live", this.articleForm.value.live);
      formData.append("CategoryId", this.articleForm.value.categoryId);
      formData.append("SubcategoryId", this.articleForm.value.subcategoryId);
      formData.append("PublishedAt", this.articleForm.value.publishedAt);
      formData.append("MainPhoto", this.articleForm.value.mainPhoto);
      this.articleForm.value.additionalPhotos.forEach((file: File) => {
        formData.append("AdditionalPhotos", file);
      });

      this.apiService.post('/articles', formData)
        .then((response: any) => {
          console.log('Članak kreiran:', response);
          this.router.navigate(['admin/articles']);
          this.toastr.success('Uspješno dodano!', 'Notifikacija');
        })
        .catch((error: any) => {
          this.errorMessage = 'Došlo je do greške prilikom kreiranja članka.';
          console.error('Error saving article:', error);
        });
    } else {
      console.log('Forma nije validna!');
    }
  }
}
