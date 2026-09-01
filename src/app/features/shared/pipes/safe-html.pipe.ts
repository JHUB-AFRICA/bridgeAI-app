// ============================================================
// BRIDGE-AI Kenya - Safe HTML Pipe
// ============================================================

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

export type SafeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, type: SafeType = 'html'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl | string {
    if (!value) {
      return '';
    }

    switch (type) {
      case 'html':
        return this.sanitizer.sanitize(1, value) || '';
      case 'style':
        return this.sanitizer.sanitize(2, value) || '';
      case 'script':
        return this.sanitizer.sanitize(3, value) || '';
      case 'url':
        return this.sanitizer.sanitize(4, value) || '';
      case 'resourceUrl':
        return this.sanitizer.sanitize(5, value) || '';
      default:
        return value;
    }
  }
}