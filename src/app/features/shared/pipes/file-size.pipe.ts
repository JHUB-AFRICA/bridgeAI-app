// ============================================================
// BRIDGE-AI Kenya - File Size Pipe
// ============================================================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number | null | undefined, decimals: number = 2): string {
    if (bytes === null || bytes === undefined) {
      return '0 Bytes';
    }

    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return size + ' ' + sizes[i];
  }
}