// ============================================================
// BRIDGE-AI Kenya - Public Module
// ============================================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicRoutes } from './public-routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PublicRoutes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class PublicModule {}