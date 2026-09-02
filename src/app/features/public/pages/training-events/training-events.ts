import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-training-events',
  imports: [CommonModule, RouterLink],
  styleUrl: './training-events.css',
  templateUrl: './training-events.html',
})
export class TrainingEvents implements OnInit {
  private readonly eventService = inject(EventService);

  protected readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  protected readonly allEvents = signal<Event[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly status = signal('');
  protected readonly audience = signal('');
  protected readonly year = signal('');
  protected readonly month = signal('');

  protected readonly audiences = computed(() => Array.from(new Set(
    this.allEvents()
      .map(event => event.audience)
      .filter((value): value is string => Boolean(value))
  )).sort());

  protected readonly years = computed(() => Array.from(new Set(
    this.allEvents()
      .map(event => new Date(event.date).getFullYear())
      .filter(year => Number.isFinite(year))
  )).sort((first, second) => second - first));

  protected readonly filteredEvents = computed(() => this.allEvents()
    .filter(event => {
      const date = new Date(event.date);
      return (!this.status() || event.status === this.status())
        && (!this.audience() || event.audience === this.audience())
        && (!this.year() || date.getFullYear() === Number(this.year()))
        && (!this.month() || date.getMonth() + 1 === Number(this.month()));
    })
    .sort((first, second) => first.date.localeCompare(second.date)));

  protected readonly timeline = computed(() => {
    const grouped = new Map<number, Map<number, Event[]>>();

    for (const event of this.filteredEvents()) {
      const date = new Date(event.date);
      if (!Number.isFinite(date.getTime())) continue;

      const year = date.getFullYear();
      const month = date.getMonth();
      if (!grouped.has(year)) grouped.set(year, new Map());

      const months = grouped.get(year)!;
      if (!months.has(month)) months.set(month, []);
      months.get(month)!.push(event);
    }

    return Array.from(grouped.entries())
      .sort((first, second) => second[0] - first[0])
      .map(([year, months]) => ({
        year,
        months: Array.from(months.entries())
          .sort((first, second) => first[0] - second[0])
          .map(([month, events]) => ({ name: this.monthNames[month], events }))
      }));
  });

  protected readonly counts = computed(() => ({
    upcoming: this.allEvents().filter(event => event.status === 'upcoming').length,
    ongoing: this.allEvents().filter(event => event.status === 'ongoing').length,
    completed: this.allEvents().filter(event => event.status === 'completed').length,
    total: this.allEvents().length
  }));

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.allEvents.set(events ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.allEvents.set([]);
        this.isLoading.set(false);
      }
    });
  }

  protected setFilter(filter: 'status' | 'audience' | 'year' | 'month', event: globalThis.Event): void {
    this[filter].set((event.target as HTMLSelectElement).value);
  }

  protected clearFilters(): void {
    this.status.set('');
    this.audience.set('');
    this.year.set('');
    this.month.set('');
  }

  protected imageFor(event: Event): string {
    return event.featured_image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80';
  }

  protected eventMonth(event: Event): string {
    const date = new Date(event.date);
    return Number.isFinite(date.getTime()) ? this.monthNames[date.getMonth()].slice(0, 3) : '---';
  }

  protected eventDay(event: Event): string {
    const date = new Date(event.date);
    return Number.isFinite(date.getTime()) ? String(date.getDate()).padStart(2, '0') : '--';
  }
}
