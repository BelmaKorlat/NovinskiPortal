import { Component, Renderer2 } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent {
  private loadedScripts: HTMLScriptElement[] = [];
  private loadedStyles: HTMLLinkElement[] = [];

  cssFiles: string[] = [
    "/assets/public/css/bootstrap.min.css",
    "/assets/public/css/animate.min.css",
    "/assets/public/css/magnific-popup.css",
    "/assets/public/css/slick.css",
    "/assets/public/css/nice-select.css",
    "/assets/public/css/style.css"
  ];

  jsFiles: string[] = [

    "/assets/public/js/vendor/modernizr-3.5.0.min.js",
    "/assets/public/js/vendor/jquery-1.12.4.min.js",
    "/assets/public/js/popper.min.js",
    "/assets/public/js/bootstrap.min.js",
    "/assets/public/js/jquery.slicknav.min.js",
    "/assets/public/js/slick.min.js",
    "/assets/public/js/gijgo.min.js",
    "/assets/public/js/wow.min.js",
    "/assets/public/js/animated.headline.js",
    "/assets/public/js/jquery.magnific-popup.js",
    "/assets/public/js/jquery.ticker.js",
    "/assets/public/js/site.js",
    "/assets/public/js/jquery.scrollUp.min.js",
    "/assets/public/js/jquery.nice-select.min.js",
    "/assets/public/js/jquery.sticky.js",
    "/assets/public/js/contact.js",
    "/assets/public/js/jquery.form.js",
    "/assets/public/js/jquery.validate.min.js",
    "/assets/public/js/mail-script.js",
    "/assets/public/js/jquery.ajaxchimp.min.js",
    "/assets/public/js/plugins.js",
    "/assets/public/js/main.js"
  ];

  categories: any[] = [];
  today?: Date;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private renderer: Renderer2
  ) {
  }

  loadStyle(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
    this.loadedStyles.push(link);
  }

  loadScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.async = false;
    this.renderer.appendChild(document.body, script);
    this.loadedScripts.push(script);
  }

  ngOnInit(): void {
    this.loadCategoriesMenu();
    this.cssFiles.forEach(href => this.loadStyle(href));
    this.jsFiles.forEach(src => this.loadScript(src));
    this.today = new Date();
    setInterval(() => {
      this.today = new Date();
    }, 1000);
  }

  loadCategoriesMenu(): void {
    this.apiService.get<any[]>('/categories/categories-menu')
      .then((response: any) => {
        this.categories = response;
      })
      .catch((error: any) => {
        console.error('Error fetching categories:', error);
      });
  }

  onSearch(value: string) {
    this.router.navigate(['search'], { queryParams: { term: value } });
  }

}
