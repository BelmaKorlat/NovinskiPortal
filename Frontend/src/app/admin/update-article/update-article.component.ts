import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, NgxEditorModule } from 'ngx-editor';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxEditorModule, RouterLink],
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.css']
})
export class UpdateArticleComponent implements OnInit {
  editor!: Editor;
  articleForm!: FormGroup;
  errorMessage: string = '';
  categories: any[] = [];
  subcategories: any[] = [];
  previewMain: string | null = null;
  previewGallery: string[] = [];
  articleId!: number;
  currentMainPhoto?: string;
  currentAdditionalPhotos?: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.articleForm = this.fb.group({
      headline: ['', Validators.required],
      subheadline: ['', Validators.required],
      shortText: ['', Validators.required],
      text: ['', Validators.required],
      active: [true],
      hideFullName: [true],
      breakingNews: [true],
      live: [true],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
      publishedAt: ['', Validators.required],
      mainPhoto: [null],
      additionalPhotos: [[]]
    });
  }

  ngOnInit(): void {
    this.articleId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();
    this.loadSubcategories();
    this.loadArticle();
    this.editor = new Editor();

    flatpickr('#publishedAt', {
      enableTime: true,
      dateFormat: 'd.m.Y H:i',
      defaultDate: new Date()
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadArticle(): void {
    this.apiService.get(`/articles/${this.articleId}`)
      .then((response: any) => {
        this.populateForm(response);
        this.currentMainPhoto = response.mainPhotoPath;
        this.currentAdditionalPhotos = response.additionalPhotos;
      })
      .catch((error: any) => {
        console.error('Greška pri učitavanju članka:', error);
        this.errorMessage = 'Došlo je do greške pri učitavanju članka.';
      });
  }

  populateForm(articleData: any): void {
    this.articleForm.patchValue({
      headline: articleData.headline,
      subheadline: articleData.subheadline,
      shortText: articleData.shortText,
      text: articleData.text,
      active: articleData.active,
      hideFullName: articleData.hideFullName,
      breakingNews: articleData.breakingNews,
      live: articleData.live,
      categoryId: articleData.categoryId,
      subcategoryId: articleData.subcategoryId,
      publishedAt: articleData.publishedAt,
      additionalPhotos: [[]]
    });
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

      this.apiService.put(`/articles/${this.articleId}`, formData)
        .then((response: any) => {
          this.router.navigate(['admin/articles']);
          this.toastr.success('Uspješno ažurirano!', 'Notifikacija');
        })
        .catch((error: any) => {
          this.errorMessage = 'Došlo je do greške prilikom ažuriranja članka.';
          console.error('Error saving article:', error);
        });
    } else {
      console.log('Forma nije validna!');
    }
  }
}
