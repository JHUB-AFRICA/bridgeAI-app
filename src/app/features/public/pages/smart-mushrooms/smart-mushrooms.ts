import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-smart-mushrooms',
  styleUrl: './smart-mushrooms.css',
  templateUrl: './smart-mushrooms.html',
})
export class SmartMushrooms {
  protected scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    const header = document.querySelector('.site-header') as HTMLElement | null;
    const sectionNav = document.querySelector('.smart-page .section-nav') as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const navHeight = sectionNav?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - navHeight - 12;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${sectionId}`);
  }
}
