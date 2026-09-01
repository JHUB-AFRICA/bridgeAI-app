// ============================================================
// BRIDGE-AI Kenya - Truncate Pipe
// ============================================================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 100, trail: string = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    const truncated = value.substring(0, limit).trim();
    return truncated + trail;
  }
}