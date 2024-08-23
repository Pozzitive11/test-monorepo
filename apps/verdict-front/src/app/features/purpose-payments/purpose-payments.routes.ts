import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'


export const purposePaymentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pp-page/pp-page.component').then((m) => m.PpPageComponent),
    canActivate: [AuthGuard],
    title: 'Рознесення платежів',

    children: [
      {
        path: '',
        loadComponent: () => import('./pages/pp-buffer-page/pp-buffer-page.component').then((m) => m.PpBufferPageComponent),
        canActivate: [AuthGuard],
        title: 'Рознесення платежів'
      },
      {
        path: 'process_purpose_payments',
        loadComponent: () => import('./pages/pp-processing-page/pp-processing-page.component').then((m) => m.PpProcessingPageComponent),
        canActivate: [AuthGuard],
        title: 'Обробка платежів'
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/pp-history-page/pp-history-page.component').then((m) => m.PpHistoryPageComponent),
        canActivate: [AuthGuard],
        title: 'Історія обробки платежів'
      },
      {
        path: 'verification',
        loadComponent: () => import('./pages/pp-verification-page/pp-verification-page.component').then((m) => m.PpVerificationPageComponent),
        canActivate: [AuthGuard],
        title: 'Звірка платежів'
      }
    ]
  }
]
