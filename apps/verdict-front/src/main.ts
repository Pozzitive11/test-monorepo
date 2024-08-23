import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptorService } from './app/core/interceptors/auth-interceptor.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ActivatedRouteSnapshot, provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { AuthService } from './app/core/services/auth.service';
import {
  CalendarDateFormatter,
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CustomDateFormatter } from './app/features/open-court/components/personal-cabinet/event-calendar/custom-date-formatter';

registerLocaleData(localeUk);

if (environment.production) {
  enableProdMode();
}

const initUser = (authService: AuthService) => async () =>
  authService.autoLogIn();

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initUser,
      deps: [AuthService],
      multi: true,
    },
    provideRouter(appRoutes),
    provideStore({}),
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot) =>
        (window.location.href = route.data['externalUrl']),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ],
}).catch((err) => console.error(err));
