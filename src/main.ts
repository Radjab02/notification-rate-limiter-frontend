import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import 'zone.js'; //to fix change detection issue
import { provideZoneChangeDetection } from '@angular/core'; //to fix change detection issue

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: false }) //to fix change detection issue
  ]
}).catch(err => console.error(err));

