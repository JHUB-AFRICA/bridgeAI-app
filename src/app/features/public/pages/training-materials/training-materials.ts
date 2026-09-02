import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrainingMaterialService } from '../../../../services/training-material.service';
import { TrainingMaterial } from '../../../core/models/training-material.model';

@Component({
  selector: 'app-training-materials',
  imports: [CommonModule, RouterLink],
  styleUrl: './training-materials.css',
  templateUrl: './training-materials.html',
})
export class TrainingMaterialsComponent implements OnInit {
  private readonly materialService = inject(TrainingMaterialService);
  protected readonly materials = signal<TrainingMaterial[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly search = signal('');
  protected readonly level = signal('');
  protected readonly type = signal('');
  protected readonly language = signal('');
  protected readonly filteredMaterials = computed(() => {
    const search = this.search().toLowerCase().trim();
    return this.materials().filter(material => {
      const searchable = [material.title, material.description, ...material.tags].join(' ').toLowerCase();
      return (!this.level() || material.level === this.level())
        && (!this.type() || material.resource_type === this.type())
        && (!this.language() || material.language === this.language())
        && (!search || searchable.includes(search));
    });
  });
  protected readonly counts = computed(() => ({
    total: this.materials().length,
    beginner: this.materials().filter(material => material.level === 'beginner').length,
    intermediate: this.materials().filter(material => material.level === 'intermediate').length,
    advanced: this.materials().filter(material => material.level === 'advanced').length,
  }));

  ngOnInit(): void {
    this.materialService.getPublicMaterials().subscribe({
      next: materials => { this.materials.set(materials ?? []); this.isLoading.set(false); },
      error: () => { this.materials.set([]); this.isLoading.set(false); },
    });
  }

  protected setSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); }
  protected setLevel(event: Event): void { this.level.set((event.target as HTMLSelectElement).value); }
  protected setType(event: Event): void { this.type.set((event.target as HTMLSelectElement).value); }
  protected setLanguage(event: Event): void { this.language.set((event.target as HTMLSelectElement).value); }
  protected clearFilters(): void { this.search.set(''); this.level.set(''); this.type.set(''); this.language.set(''); }

  protected fileIcon(filePath?: string): { label: string; className: string } {
    const extension = filePath?.split('.').pop()?.toLowerCase() ?? '';
    const icons: Record<string, { label: string; className: string }> = {
      pdf: { label: 'PDF', className: 'pdf' }, doc: { label: 'DOC', className: 'docx' }, docx: { label: 'DOCX', className: 'docx' },
      ppt: { label: 'PPT', className: 'pptx' }, pptx: { label: 'PPTX', className: 'pptx' }, mp4: { label: 'MP4', className: 'mp4' },
      mov: { label: 'MOV', className: 'mp4' }, zip: { label: 'ZIP', className: 'zip' }, rar: { label: 'RAR', className: 'zip' },
      png: { label: 'PNG', className: 'image' }, jpg: { label: 'JPG', className: 'image' }, jpeg: { label: 'JPEG', className: 'image' }, webp: { label: 'WEBP', className: 'image' },
    };
    return icons[extension] ?? { label: extension.toUpperCase() || 'FILE', className: 'other' };
  }

  protected typeLabel(type: string): string { return type.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase()); }
}
