import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { CategoryComponent } from './category/category.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';

export const publicRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: "category/:categoryId", component: CategoryComponent },
      { path: "category/:categoryId/:subcategoryId", component: CategoryComponent },
      { path: "article/:id", component: ArticleDetailsComponent },
      { path: "search", component: SearchComponent },
      { path: "", component: HomeComponent },
    ]
  }
];
