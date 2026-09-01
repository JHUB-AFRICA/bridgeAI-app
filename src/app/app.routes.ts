// ============================================================
// BRIDGE-AI Kenya - Main Application Routes
// ============================================================

import { Routes } from '@angular/router';
import { PublicRoutes } from './features/public/public-routes';
import { AdminRoutes } from './features/admin/admin-routes';
import { AuthGuard } from './features/core/guards/auth.guard';

export const routes: Routes = [
  ...PublicRoutes,
  ...AdminRoutes,
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];