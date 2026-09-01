// ============================================================
// BRIDGE-AI Kenya - Shared Module
// ============================================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';

// Directives
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { SortableHeaderDirective } from './directives/sortable-header.directive';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { EuFundingBannerComponent } from './components/eu-funding-banner/eu-funding-banner.component';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { ResourceCardComponent } from './components/resource-card/resource-card.component';
import { PartnerCardComponent } from './components/partner-card/partner-card.component';
import { GalleryGridComponent } from './components/gallery-grid/gallery-grid.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { PaginationComponent } from './components/pagination/pagination.component';

// Cloudinary Components
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { CloudinaryImageComponent } from './components/cloudinary-image/cloudinary-image.component';
import { CloudinaryVideoComponent } from './components/cloudinary-video/cloudinary-video.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe,
    SafeHtmlPipe,
    FileSizePipe,
    LazyLoadDirective,
    SortableHeaderDirective,
    HeaderComponent,
    FooterComponent,
    EuFundingBannerComponent,
    ActivityCardComponent,
    EventCardComponent,
    ResourceCardComponent,
    PartnerCardComponent,
    GalleryGridComponent,
    FilterBarComponent,
    PaginationComponent,
    FileUploadComponent,
    ImageUploadComponent,
    DocumentUploadComponent,
    CloudinaryImageComponent,
    CloudinaryVideoComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe,
    SafeHtmlPipe,
    FileSizePipe,
    LazyLoadDirective,
    SortableHeaderDirective,
    HeaderComponent,
    FooterComponent,
    EuFundingBannerComponent,
    ActivityCardComponent,
    EventCardComponent,
    ResourceCardComponent,
    PartnerCardComponent,
    GalleryGridComponent,
    FilterBarComponent,
    PaginationComponent,
    FileUploadComponent,
    ImageUploadComponent,
    DocumentUploadComponent,
    CloudinaryImageComponent,
    CloudinaryVideoComponent
  ]
})
export class SharedModule {}