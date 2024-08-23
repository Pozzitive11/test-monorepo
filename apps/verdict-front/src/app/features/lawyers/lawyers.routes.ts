import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const lawyersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./lawyers.component').then((m) => m.LawyersComponent),
        canActivate: [AuthGuard],
        title: 'Пошук ЄДРСР',
        pathMatch: 'full'
      },
      {
        path: 'file/:name',
        loadComponent: () => import('./components/lawyers-file/lawyers-file.component').then((m) => m.LawyersFileComponent),
        canActivate: [AuthGuard],
        title: 'Детальна таблиця'
      },
      {
        path: 'bot',
        loadComponent: () => import('./components/lawyers-bot/lawyers-bot.component').then((m) => m.LawyersBotComponent),
        canActivate: [AuthGuard],
        title: 'Засідання'
      },
      {
        path: 'events',
        loadComponent: () => import('./components/lawyers-events/lawyers-events.component').then((m) => m.LawyersEventsComponent),
        canActivate: [AuthGuard],
        title: 'Очікувані події'
      }
    ]
  }
]
