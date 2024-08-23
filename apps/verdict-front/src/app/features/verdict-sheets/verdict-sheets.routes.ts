import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard'

export const verdictSheetsRoutes: Routes = [
  {
    path: 'config',
    loadComponent: () => import('./pages/vs-config-page/vs-config-page.component').then((m) => m.VsConfigPageComponent),
    title: 'Конфігурація таблиць',
    canActivate: [AuthGuard]
  },
  {
    path: 'config/:uid',
    loadComponent: () => import('./pages/vs-config-page/vs-config-page.component').then((m) => m.VsConfigPageComponent),
    title: 'Конфігурація таблиці',
    canActivate: [AuthGuard]
  },
  {
    path: ':uid',
    loadComponent: () => import('./pages/vs-sheet-edit-page/vs-sheet-edit-page.component').then((m) => m.VsSheetEditPageComponent),
    title: 'Редагування таблиці',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'pivot/:uid',
    loadComponent: () => import('./pages/vs-pivot-table-page/vs-pivot-table-page.component').then((m) => m.VsPivotTablePageComponent),
    title: 'Зведена таблиця',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: '',
    loadComponent: () => import('./pages/vs-sheets-page/vs-sheets-page.component').then((m) => m.VsSheetsPageComponent),
    title: 'Таблиці',
    canActivate: [AuthGuard]
  }
]
