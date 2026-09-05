// ============================================================
// BRIDGE-AI Kenya - Cloudinary Service
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}

export interface CloudinaryUploadOptions {
  resource_type?: 'image' | 'video' | 'raw';
  folder?: string;
  public_id?: string;
  tags?: string[];
  transformation?: string;
  quality?: string;
  format?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;
  private folder = environment.cloudinary.folder;
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, options?: CloudinaryUploadOptions): Observable<CloudinaryUploadResult> {
    const module = this.getUploadModule(options?.folder);
    if (options?.resource_type === 'image' && module) {
      const formData = new FormData();
      formData.append('file', file);
      return this.http.post<{
        success: boolean;
        url: string;
        public_id: string;
        format: string;
        width: number;
        height: number;
      }>(`${environment.apiUrl}/upload/${module}`, formData).pipe(
        map(response => ({
          ...response,
          secure_url: response.url,
          public_id: response.public_id
        } as unknown as CloudinaryUploadResult)),
        catchError((error) => {
          console.error('Cloudinary upload error:', error);
          return throwError(() => new Error('Failed to upload file to Cloudinary'));
        })
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const folder = options?.folder
      ? (options.folder.startsWith('bridge-ai/') ? options.folder : `bridge-ai/${options.folder}`)
      : this.folder;
    if (folder) {
      formData.append('folder', folder);
    }

    if (options) {
      if (options.resource_type) {
        formData.append('resource_type', options.resource_type);
      }
      if (options.public_id) {
        formData.append('public_id', options.public_id);
      }
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }
    }

    return this.http.post<CloudinaryUploadResult>(this.uploadUrl, formData).pipe(
      catchError((error) => {
        console.error('Cloudinary upload error:', error);
        return throwError(() => new Error('Failed to upload file to Cloudinary'));
      })
    );
  }

  private getUploadModule(folder?: string): string | null {
    const module = folder?.replace(/^bridge-ai\//, '').replace(/\/$/, '');
    return module && ['activities', 'events', 'gallery', 'team', 'resources', 'stories', 'partners'].includes(module)
      ? module
      : null;
  }

  uploadImage(file: File): Observable<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      resource_type: 'image',
      tags: ['bridge-ai', 'image']
    });
  }

  uploadVideo(file: File): Observable<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      resource_type: 'video',
      tags: ['bridge-ai', 'video']
    });
  }

  uploadDocument(file: File, folder?: string): Observable<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      resource_type: 'raw',
      folder,
      tags: ['bridge-ai', 'document']
    });
  }

  uploadFileByType(file: File): Observable<CloudinaryUploadResult> {
    const fileType = this.determineFileType(file);
    switch (fileType) {
      case 'image':
        return this.uploadImage(file);
      case 'video':
        return this.uploadVideo(file);
      case 'document':
      default:
        return this.uploadDocument(file);
    }
  }

  private determineFileType(file: File): 'image' | 'video' | 'document' {
    const type = file.type;
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type.startsWith('video/')) {
      return 'video';
    }
    return 'document';
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: File): boolean {
    return file.type.startsWith('video/');
  }

  isDocument(file: File): boolean {
    return !this.isImage(file) && !this.isVideo(file);
  }

  getTransformedUrl(publicId: string, transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    gravity?: string;
    radius?: number;
    angle?: number;
    effect?: string;
  }): string {
    let baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;

    if (transformations) {
      const parts: string[] = [];
      if (transformations.width) parts.push(`w_${transformations.width}`);
      if (transformations.height) parts.push(`h_${transformations.height}`);
      if (transformations.crop) parts.push(`c_${transformations.crop}`);
      if (transformations.quality) parts.push(`q_${transformations.quality}`);
      if (transformations.format) parts.push(`f_${transformations.format}`);
      if (transformations.gravity) parts.push(`g_${transformations.gravity}`);
      if (transformations.radius) parts.push(`r_${transformations.radius}`);
      if (transformations.angle) parts.push(`a_${transformations.angle}`);
      if (transformations.effect) parts.push(`e_${transformations.effect}`);

      if (parts.length > 0) {
        baseUrl += `/${parts.join(',')}`;
      }
    }

    return `${baseUrl}/${publicId}`;
  }

  getVideoThumbnail(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    start_offset?: number;
  }): string {
    let baseUrl = `https://res.cloudinary.com/${this.cloudName}/video/upload`;

    const parts: string[] = [];
    if (options?.width) parts.push(`w_${options.width}`);
    if (options?.height) parts.push(`h_${options.height}`);
    if (options?.crop) parts.push(`c_${options.crop}`);
    if (options?.start_offset !== undefined) parts.push(`so_${options.start_offset}`);

    if (parts.length > 0) {
      baseUrl += `/${parts.join(',')}`;
    }

    return `${baseUrl}/${publicId}.jpg`;
  }

  extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return null;

      let publicId = parts.slice(uploadIndex + 2).join('/');

      const lastDot = publicId.lastIndexOf('.');
      if (lastDot > 0) {
        publicId = publicId.substring(0, lastDot);
      }

      const versionMatch = publicId.match(/^v\d+\//);
      if (versionMatch) {
        publicId = publicId.substring(versionMatch[0].length);
      }

      return publicId;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }

  deleteFile(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image'): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/upload/delete`, { body: { public_id: publicId, resource_type: resourceType } }).pipe(
      map((response: any) => {
        if (response?.success === false && response?.result !== 'not found') {
          throw new Error('Cloudinary did not delete the file');
        }
        return response;
      }),
      catchError((error) => {
        console.error('Cloudinary delete error:', error);
        return throwError(() => new Error('Failed to delete file from Cloudinary'));
      })
    );
  }

  deleteUrls(urls: Array<string | undefined>): Observable<void> {
    const media = urls
      .filter((url): url is string => !!url)
      .map(url => ({ publicId: this.extractPublicId(url), resourceType: this.extractResourceType(url) }))
      .filter((item): item is { publicId: string; resourceType: 'image' | 'raw' | 'video' } => !!item.publicId);
    const uniqueMedia = [...new Map(media.map(item => [`${item.resourceType}:${item.publicId}`, item])).values()];

    if (uniqueMedia.length === 0) return of(void 0);

    return forkJoin(uniqueMedia.map(item => this.deleteFile(item.publicId, item.resourceType))).pipe(
      map(() => void 0)
    );
  }

  private extractResourceType(url: string): 'image' | 'raw' | 'video' {
    const parts = url.split('/');
    const resourceTypeIndex = parts.indexOf('res.cloudinary.com') + 2;
    const resourceType = parts[resourceTypeIndex];
    return resourceType === 'raw' || resourceType === 'video' ? resourceType : 'image';
  }

  generateDeliveryUrl(publicId: string, options?: {
    resource_type?: string;
    format?: string;
    transformations?: string;
  }): string {
    const resourceType = options?.resource_type || 'image';
    const format = options?.format ? `.${options.format}` : '';
    const transform = options?.transformations ? `${options.transformations}/` : '';

    return `https://res.cloudinary.com/${this.cloudName}/${resourceType}/upload/${transform}${publicId}${format}`;
  }
}