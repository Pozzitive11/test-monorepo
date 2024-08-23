import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const reqRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    title: 'Перевірка заявок',
    loadComponent: () => import('./pages/req-info-page/req-info-page.component').then(m => m.ReqInfoPageComponent),
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        title: 'Перевірка заявок',
        loadComponent: () => import('./pages/req-check-page/req-check-page.component').then(m => m.ReqCheckPageComponent)
      }
    ]
  }
]
