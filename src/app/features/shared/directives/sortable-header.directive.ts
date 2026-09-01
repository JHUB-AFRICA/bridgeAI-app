// ============================================================
// BRIDGE-AI Kenya - Sortable Header Directive
// ============================================================

import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, OnInit } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | 'none';

@Directive({
  selector: '[appSortableHeader]',
  standalone: true
})
export class SortableHeaderDirective implements OnInit, OnChanges {
  @Input() appSortableHeader: string = '';
  @Input() sortDirection: SortDirection = 'none';
  @Input() active: boolean = false;

  @Output() sort = new EventEmitter<{ column: string; direction: SortDirection }>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateSortIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sortDirection'] || changes['active']) {
      this.updateSortIcon();
    }
  }

  @HostListener('click')
  onClick(): void {
    if (!this.appSortableHeader) {
      return;
    }

    let newDirection: SortDirection;

    switch (this.sortDirection) {
      case 'asc':
        newDirection = 'desc';
        break;
      case 'desc':
        newDirection = 'asc';
        break;
      case 'none':
      default:
        newDirection = 'asc';
        break;
    }

    this.sort.emit({
      column: this.appSortableHeader,
      direction: newDirection
    });
  }

  @HostListener('keydown.enter')
  onKeyDown(): void {
    this.onClick();
  }

  private updateSortIcon(): void {
    const element = this.el.nativeElement;

    const existingIcon = element.querySelector('.sort-icon');
    if (existingIcon) {
      this.renderer.removeChild(element, existingIcon);
    }

    if (!this.active) {
      this.renderer.removeClass(element, 'sortable-active');
      const icon = this.createIcon('sort');
      this.renderer.appendChild(element, icon);
      return;
    }

    this.renderer.addClass(element, 'sortable-active');

    let iconName: string;
    switch (this.sortDirection) {
      case 'asc':
        iconName = 'sort-amount-up-alt';
        break;
      case 'desc':
        iconName = 'sort-amount-down';
        break;
      default:
        iconName = 'sort';
        break;
    }

    const icon = this.createIcon(iconName);
    this.renderer.appendChild(element, icon);
  }

  private createIcon(iconName: string): HTMLElement {
    const icon = this.renderer.createElement('span');
    this.renderer.addClass(icon, 'sort-icon');
    this.renderer.addClass(icon, 'ml-1');
    this.renderer.addClass(icon, 'inline-block');
    this.renderer.addClass(icon, 'text-gray-400');

    const svg = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'width', '12');
    this.renderer.setAttribute(svg, 'height', '12');
    this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
    this.renderer.setAttribute(svg, 'fill', 'none');
    this.renderer.setAttribute(svg, 'stroke', 'currentColor');
    this.renderer.setAttribute(svg, 'stroke-width', '2');
    this.renderer.setAttribute(svg, 'stroke-linecap', 'round');
    this.renderer.setAttribute(svg, 'stroke-linejoin', 'round');

    let pathD: string;

    switch (iconName) {
      case 'sort-amount-up-alt':
        pathD = 'M3 16l4-4 4 4M7 4v12M17 20V8M14 11l3-3 3 3';
        break;
      case 'sort-amount-down':
        pathD = 'M3 8l4 4 4-4M7 20V8M17 4v12M14 13l3 3 3-3';
        break;
      default:
        pathD = 'M3 16l4-4 4 4M7 4v12M17 20V8M14 11l3-3 3 3';
        break;
    }

    const path = this.renderer.createElement('path', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(path, 'd', pathD);

    this.renderer.appendChild(svg, path);
    this.renderer.appendChild(icon, svg);

    return icon;
  }

  private getAriaLabel(): string {
    if (!this.active) {
      return 'Click to sort';
    }

    switch (this.sortDirection) {
      case 'asc':
        return 'Sorted ascending. Click to sort descending.';
      case 'desc':
        return 'Sorted descending. Click to sort ascending.';
      default:
        return 'Click to sort';
    }
  }

  private updateAriaAttributes(): void {
    const element = this.el.nativeElement;

    if (this.active) {
      this.renderer.setAttribute(element, 'aria-sort', this.sortDirection === 'asc' ? 'ascending' : 'descending');
    } else {
      this.renderer.removeAttribute(element, 'aria-sort');
    }

    this.renderer.setAttribute(element, 'aria-label', this.getAriaLabel());
  }
}