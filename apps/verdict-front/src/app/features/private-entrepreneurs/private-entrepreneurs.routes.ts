import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const peRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    title: 'Робота з рахунками ФОП',
    loadComponent: () => import('./pages/pe-info-page/pe-info-page.component').then(m => m.PeInfoPageComponent),
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        title: 'ФОП | Інформаційна панель',
        loadComponent: () => import('./components/pe-dashboard/pe-dashboard.component').then(m => m.PeDashboardComponent)
      },
      {
        path: 'table',
        canActivate: [AuthGuard],
        title: 'ФОП | Таблиця',
        loadComponent: () => import('./pages/pe-info-table/pe-info-table.component').then(m => m.PeInfoTableComponent)
      }
    ]
  }
]
