import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { CreateSubcategoryComponent } from './create-subcategory/create-subcategory.component';
import { UpdateSubcategoryComponent } from './update-subcategory/update-subcategory.component';
import { ArticlesComponent } from './articles/articles.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { UpdateArticleComponent } from './update-article/update-article.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/create', component: CreateCategoryComponent },
      { path: 'categories/update/:id', component: UpdateCategoryComponent },
      { path: 'subcategories', component: SubcategoriesComponent },
      { path: 'subcategories/create', component: CreateSubcategoryComponent },
      { path: 'subcategories/update/:id', component: UpdateSubcategoryComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'articles/create', component: CreateArticleComponent },
      { path: 'articles/update/:id', component: UpdateArticleComponent }
    ]
  }
];
