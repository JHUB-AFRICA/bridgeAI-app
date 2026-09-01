// ============================================================
// BRIDGE-AI Kenya - Training Events Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../core/models/event.model';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { FilterBarComponent, FilterOption } from '../../../shared/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-training-events',
  standalone: true,
  imports: [
    CommonModule,
    EventCardComponent,
    FilterBarComponent,
    PaginationComponent
  ],
  template: `
    <div class="training-events-page">
      <div class="container">
        <h1 class="page-title">Training Events</h1>

        <app-filter-bar
          [filters]="filters"
          [selected]="selectedFilters"
          [resultCount]="filteredEvents().length"
          (filterChange)="onFilterChange($event)"
          (clearFiltersEvent)="onClearFilters()"
        ></app-filter-bar>

        <div class="events-grid">
          <app-event-card
            *ngFor="let event of paginatedEvents()"
            [event]="event"
          ></app-event-card>
        </div>

        <div *ngIf="filteredEvents().length === 0" class="empty-state">
          <p>No training events found matching your criteria.</p>
        </div>

        <app-pagination
          [totalItems]="filteredEvents().length"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
  styles: [`
    .training-events-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 24px 0;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 0;
      color: #6b7280;
    }

    @media (max-width: 1024px) {
      .events-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .events-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TrainingEventsComponent implements OnInit {
  protected allEvents = signal<Event[]>([]);
  protected filteredEvents = signal<Event[]>([]);
  protected paginatedEvents = signal<Event[]>([]);

  protected currentPage: number = 1;
  protected pageSize: number = 6;
  protected selectedFilters: Record<string, string> = {};

  protected filters: { key: string; label: string; options: FilterOption[] }[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      key: 'audience',
      label: 'Audience',
      options: []
    }
  ];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents.set(events);
        this.updateFilterOptions(events);
        this.applyFilters();
      },
      error: () => {
        this.allEvents.set([]);
        this.filteredEvents.set([]);
      }
    });
  }

  private updateFilterOptions(events: Event[]): void {
    const audiences = Array.from(
      new Set(events.flatMap(event => (event.audience ? [event.audience] : [])))
    );

    this.filters = this.filters.map((filter): { key: string; label: string; options: FilterOption[] } => {
      if (filter.key === 'audience') {
        return {
          ...filter,
          options: audiences.map((audience): FilterOption => ({
            value: audience,
            label: audience
          }))
        };
      }
      return filter;
    });
  }

  protected onFilterChange(filters: Record<string, string>): void {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.applyFilters();
  }

  protected onClearFilters(): void {
    this.selectedFilters = {};
    this.currentPage = 1;
    this.applyFilters();
  }

  protected onPageChange(event: { page: number; size: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.size;
    this.updatePagination();
  }

  private applyFilters(): void {
    let filtered = [...this.allEvents()];

    if (this.selectedFilters['status']) {
      filtered = filtered.filter(e => e.status === this.selectedFilters['status']);
    }

    if (this.selectedFilters['audience']) {
      filtered = filtered.filter(e => e.audience === this.selectedFilters['audience']);
    }

    filtered.sort((a, b) => (a.date > b.date ? 1 : -1));
    this.filteredEvents.set(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEvents.set(this.filteredEvents().slice(start, end));
  }
}