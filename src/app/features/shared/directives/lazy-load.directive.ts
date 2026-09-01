// ============================================================
// BRIDGE-AI Kenya - Lazy Load Directive
// ============================================================

import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() appLazyLoad: string = '';
  @Input() placeholder: string = '';
  @Input() lazyLoadOffset: number = 0;
  @Input() lazyLoadRootMargin: string = '100px';

  private observer: IntersectionObserver | null = null;
  private isLoaded: boolean = false;
  private isPlatformBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isPlatformBrowser) {
      this.loadImage();
      return;
    }

    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      this.loadImage();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isPlatformBrowser) {
      return;
    }

    if (!this.observer && this.el.nativeElement) {
      if ('IntersectionObserver' in window) {
        this.setupIntersectionObserver();
      }
    }
  }

  private setupIntersectionObserver(): void {
    const element = this.el.nativeElement;
    const rootMargin = this.lazyLoadRootMargin;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoaded) {
            this.loadImage();
            this.observer?.disconnect();
          }
        });
      },
      {
        rootMargin: rootMargin,
        threshold: 0.01
      }
    );

    this.observer.observe(element);
  }

  private loadImage(): void {
    if (this.isLoaded) {
      return;
    }

    const element = this.el.nativeElement;
    const src = this.appLazyLoad || element.getAttribute('data-src');

    if (!src) {
      this.isLoaded = true;
      return;
    }

    const img = element as HTMLImageElement;

    if (this.placeholder) {
      img.src = this.placeholder;
    }

    const imageLoad = new Image();
    imageLoad.src = src;
    imageLoad.onload = () => {
      this.renderer.setAttribute(img, 'src', src);
      this.renderer.removeAttribute(img, 'data-src');
      this.renderer.addClass(img, 'loaded');
      this.isLoaded = true;
    };

    imageLoad.onerror = () => {
      this.renderer.addClass(img, 'error');
      this.isLoaded = true;
    };
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}