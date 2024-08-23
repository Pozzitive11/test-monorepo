import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'


export const asepBotRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ab-asep-bot-page/ab-asep-bot-page.component').then((m) => m.AbAsepBotPageComponent),
    canActivate: [AuthGuard],
    title: 'АСВП-бот',

    children: [
      {
        path: '',
        loadComponent: () => import('./pages/ab-info-page/ab-info-page.component').then((m) => m.AbInfoPageComponent),
        canActivate: [AuthGuard],
        title: 'АСВП-бот'
      },
      {
        path: 'uploaded',
        loadComponent: () => import('./pages/ab-asep-upload-files/ab-asep-upload-files.component').then((m) => m.AbAsepUploadFilesComponent),
        canActivate: [AuthGuard],
        title: 'АСВП-бот | Завантажені файли'
      },
      {
        path: 'uploaded/:name',
        loadComponent: () => import('./pages/ab-asep-file/ab-asep-file.component').then((m) => m.AbAsepFileComponent),
        canActivate: [AuthGuard],
        title: 'АСВП-бот | Обробка файлу'
      }
    ]
  }
]
