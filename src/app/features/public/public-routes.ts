// ============================================================
// BRIDGE-AI Kenya - Public Routes
// ============================================================

import { Routes } from '@angular/router';

export const PublicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'jkuat-role',
    loadComponent: () => import('./pages/jkuat-role/jkuat-role.component').then(m => m.JkuatRoleComponent)
  },
  {
    path: 'smart-mushrooms',
    loadComponent: () => import('./pages/smart-mushrooms/smart-mushrooms.component').then(m => m.SmartMushroomsComponent)
  },
  {
    path: 'activities',
    loadComponent: () => import('./pages/activities/activities.component').then(m => m.ActivitiesComponent)
  },
  {
    path: 'activities/:slug',
    loadComponent: () => import('./pages/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent)
  },
  {
    path: 'training-wp5',
    loadComponent: () => import('./pages/training-wp5/training-wp5.component').then(m => m.TrainingWp5Component)
  },
  {
    path: 'training-events',
    loadComponent: () => import('./pages/training-events/training-events').then(m => m.TrainingEvents)
  },
  {
    path: 'training-events/:slug',
    loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'training-materials',
    loadComponent: () => import('./pages/training-materials/training-materials').then(m => m.TrainingMaterialsComponent)
  },
  {
    path: 'training-materials/:slug',
    loadComponent: () => import('./pages/material-detail/material-detail.component').then(m => m.MaterialDetailComponent)
  },
  {
    path: 'sme-mentoring',
    loadComponent: () => import('./pages/sme-mentoring/sme-mentoring.component').then(m => m.SmeMentoringComponent)
  },
  {
    path: 'community-practice',
    loadComponent: () => import('./pages/community-practice/community-practice.component').then(m => m.CommunityPracticeComponent)
  },
  {
    path: 'replication-toolkit',
    loadComponent: () => import('./pages/replication-toolkit/replication-toolkit.component').then(m => m.ReplicationToolkitComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: 'resources/:slug',
    loadComponent: () => import('./pages/resource-detail/resource-detail.component').then(m => m.ResourceDetailComponent)
  },
  {
    path: 'partners',
    loadComponent: () => import('./pages/partners/partners.component').then(m => m.PartnersComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  {
    path: 'gallery/:slug',
    loadComponent: () => import('./pages/gallery-album/gallery-album.component').then(m => m.GalleryAlbumComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy-ethics',
    loadComponent: () => import('./pages/privacy-ethics/privacy-ethics.component').then(m => m.PrivacyEthicsComponent)
  }
];