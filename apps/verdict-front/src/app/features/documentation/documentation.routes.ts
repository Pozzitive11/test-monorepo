import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const documentationRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./documentation-pages/documentation.component').then((m) => m.DocumentationComponent),
    canActivate: [AuthGuard],
    title: 'Документація'
  },

  {
    path: 'executive',
    loadComponent: () =>
      import('./component/documentation-executive/documentation-executive.component').then(
        (m) => m.DocumentationExecutiveComponent
      ),
    canActivate: [AuthGuard],
    title: 'Виконавчі впровадження'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./component/documentation-list/documentation-list.component').then((m) => m.DocumentationListComponent),
    canActivate: [AuthGuard],
    title: 'Стоп-листи'
  }
]
