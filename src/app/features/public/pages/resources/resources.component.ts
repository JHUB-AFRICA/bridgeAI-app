// ============================================================
// BRIDGE-AI Kenya - Resources Component
// ============================================================

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService } from '../../../../services/resource.service';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-resources',
  imports: [RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {
  protected readonly types = [
    { value: 'deliverable', label: 'Deliverables', limit: 3 },
    { value: 'policy_brief', label: 'Policy Briefs', limit: 4 },
    { value: 'video', label: 'Videos', limit: 3 },
    { value: 'presentation', label: 'Presentations', limit: 2 },
    { value: 'training_kit', label: 'Training Kits', limit: 3 },
    { value: 'publication', label: 'Publications', limit: 4 },
    { value: 'open_source', label: 'Open Source', limit: Number.MAX_SAFE_INTEGER }
  ];
  protected readonly allResources = signal<Resource[]>([]);
  protected readonly currentFilter = signal('all');
  protected readonly searchTerm = signal('');
  protected readonly loading = signal(true);
  protected readonly openTraining = signal<Set<number>>(new Set());
  protected readonly expandedTypes = signal<Set<string>>(new Set());
  private readonly resourceService = inject(ResourceService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      if (type && this.types.some(resourceType => resourceType.value === type)) {
        this.currentFilter.set(type);
      }
    });

    this.resourceService.getResources().subscribe({
      next: resources => {
        this.allResources.set(resources.filter(resource => resource.is_public));
        this.loading.set(false);
      },
      error: () => {
        this.allResources.set([]);
        this.loading.set(false);
      }
    });
  }

  protected filteredResources(): Resource[] {
    const term = this.searchTerm().trim().toLowerCase();
    return this.allResources().filter(resource => {
      const matchesType = this.currentFilter() === 'all' || resource.resource_type === this.currentFilter();
      const searchable = `${resource.title} ${resource.description}`.toLowerCase();
      return matchesType && (!term || searchable.includes(term));
    });
  }

  protected itemsFor(type: string): Resource[] {
    return this.filteredResources().filter(resource => resource.resource_type === type);
  }

  protected countFor(type: string): number {
    return this.filteredResources().filter(resource => resource.resource_type === type).length;
  }

  protected visibleItems(type: string, limit: number): Resource[] {
    const items = this.itemsFor(type);
    return this.expandedTypes().has(type) ? items : items.slice(0, limit);
  }

  protected setFilter(type: string): void {
    this.currentFilter.set(type);
  }

  protected setSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected toggleMore(type: string): void {
    this.expandedTypes.update(types => {
      const next = new Set(types);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  }

  protected toggleTraining(resource: Resource): void {
    if (resource.id === undefined) return;
    this.openTraining.update(items => {
      const next = new Set(items);
      next.has(resource.id!) ? next.delete(resource.id!) : next.add(resource.id!);
      return next;
    });
  }

  protected isTrainingOpen(resource: Resource): boolean {
    return resource.id !== undefined && this.openTraining().has(resource.id);
  }

  protected formatDate(value?: string): string {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  protected resourceUrl(resource: Resource): string {
    return resource.file_path ? `/static/${resource.file_path}` : resource.external_url || '';
  }
}