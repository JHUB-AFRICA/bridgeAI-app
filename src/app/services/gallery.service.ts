// ============================================================
// BRIDGE-AI Kenya - Gallery Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { GalleryAlbum, GalleryImage } from '../features/core/models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private api: ApiService) {}

  getAlbums(): Observable<GalleryAlbum[]> {
    return this.api.get<GalleryAlbum[]>(API_ENDPOINTS.GALLERY.GET_ALL);
  }

  getPublishedAlbums(): Observable<GalleryAlbum[]> {
    return this.api.get<GalleryAlbum[]>(API_ENDPOINTS.GALLERY.GET_ALL, { is_published: true });
  }

  getAlbum(id: number): Observable<GalleryAlbum> {
    return this.api.getWithId<GalleryAlbum>(API_ENDPOINTS.GALLERY.GET_BY_ID, id);
  }

  getAlbumBySlug(slug: string): Observable<GalleryAlbum> {
    return this.api.get<GalleryAlbum>(API_ENDPOINTS.GALLERY.GET_BY_SLUG(slug));
  }

  createAlbum(album: FormData): Observable<GalleryAlbum> {
    return this.api.postFormData<GalleryAlbum>(API_ENDPOINTS.GALLERY.CREATE, album);
  }

  createAlbumJson(album: Partial<GalleryAlbum>): Observable<GalleryAlbum> {
    return this.api.post<GalleryAlbum>(API_ENDPOINTS.GALLERY.CREATE, album);
  }

  updateAlbum(id: number, album: FormData): Observable<GalleryAlbum> {
    return this.api.putFormData<GalleryAlbum>(API_ENDPOINTS.GALLERY.UPDATE(id), album);
  }

  updateAlbumJson(id: number, album: Partial<GalleryAlbum>): Observable<GalleryAlbum> {
    return this.api.put<GalleryAlbum>(API_ENDPOINTS.GALLERY.UPDATE(id), album);
  }

  deleteAlbum(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.GALLERY.DELETE(id));
  }

  addImageToAlbum(albumId: number, image: FormData): Observable<GalleryImage> {
    return this.api.postFormData<GalleryImage>(`/gallery/${albumId}/images`, image);
  }

  removeImageFromAlbum(albumId: number, imageId: number): Observable<void> {
    return this.api.delete<void>(`/gallery/${albumId}/images/${imageId}`);
  }

  updateImage(albumId: number, imageId: number, image: Partial<GalleryImage>): Observable<GalleryImage> {
    return this.api.put<GalleryImage>(`/gallery/${albumId}/images/${imageId}`, image);
  }
}