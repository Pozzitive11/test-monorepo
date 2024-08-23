import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'


export const longRequestsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/lr-long-requests-page/lr-long-requests-page.component').then((m) => m.LrLongRequestsPageComponent),
    canActivate: [AuthGuard],
    title: 'Довгі заявки',

    children: [
      {
        path: '',
        loadComponent: () => import('./pages/lr-past-info-page/lr-past-info-page.component').then((m) => m.LrPastInfoPageComponent),
        canActivate: [AuthGuard],
        title: 'Довгі заявки'
      },
      {
        path: 'promotion/:promotionId',
        loadComponent: () => import('./pages/lr-info-page/lr-info-page.component').then((m) => m.LrInfoPageComponent),
        title: 'Редагування довгої заявки'
      },
      {
        path: 'create_promotion/:contractId',
        loadComponent: () => import('./pages/lr-info-page/lr-info-page.component').then((m) => m.LrInfoPageComponent),
        title: 'Створення довгої заявки'
      },
      {
        path: 'consolidated_info',
        loadComponent: () => import('./pages/lr-consolidated-info-page/lr-consolidated-info-page.component').then((m) => m.LrConsolidatedInfoPageComponent),
        title: 'Консолідована інформація за НКС'
      }
    ]
  }
]
