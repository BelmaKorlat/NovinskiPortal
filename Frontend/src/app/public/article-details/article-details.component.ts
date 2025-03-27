import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgImageSliderModule } from 'ng-image-slider';

@Component({
  selector: 'app-public-article-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgImageSliderModule],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {
  article: any;
  gallery?: any;
  articleId?: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.articleId = +this.route.snapshot.paramMap.get('id')!;
    this.route.params.subscribe(params => {
      this.articleId = params["id"];
      this.loadArticle(this.articleId);
    });
    this.loadArticle(this.articleId);
  }

  loadArticle(articleId: number | undefined): void {
    this.apiService.get<any[]>(`/articles/${articleId}`)
      .then((response: any) => {
        this.article = response;
        if (this.article.additionalPhotos && this.article.additionalPhotos.length > 0) {
          this.gallery = this.article.additionalPhotos.map((photoPath: string) => ({
            image: photoPath,
            thumbImage: photoPath
          }));
        }
      })
      .catch((error: any) => {
        console.error('Error fetching article:', error);
      });
  }
}
