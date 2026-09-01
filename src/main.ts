// ============================================================
// BRIDGE-AI Kenya - Main Entry Point
// ============================================================

// Zone.js MUST be imported before Angular
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then(() => console.log('✅ Application bootstrapped successfully'))
  .catch((err) => console.error('❌ Bootstrap failed:', err));