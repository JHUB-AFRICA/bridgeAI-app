import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './features/shared/components/header/header.component';
import { FooterComponent } from './features/shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      @if (!isAdminRoute()) {
        <app-header></app-header>
      }
      <main class="page-content">
        <router-outlet></router-outlet>
      </main>
      @if (!isAdminRoute()) {
        <app-footer></app-footer>
      }
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  title = 'bridge-ai-angular';
  protected isAdminRoute = signal(false);

  constructor(private router: Router) {
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin')));
  }
}