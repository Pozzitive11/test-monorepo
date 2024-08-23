import { Routes } from '@angular/router'

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/components/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'zvit1',
    loadComponent: () => import('./shared/components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    resolve: {
      url: 'externalUrlRedirectResolver'
    },
    data: {
      externalUrl: 'http://10.11.32.60:8050/'
    }
  },

  {
    path: 'login',
    loadComponent: () => import('./shared/components/auth/auth.component').then((m) => m.AuthComponent),
    title: 'Вхід'
  },

  {
    path: 'purpose_payments',
    loadChildren: () => import('./features/purpose-payments/purpose-payments.routes').then((m) => m.purposePaymentsRoutes)
  },
  {
    path: 'callcenter',
    loadChildren: () => import('./features/callcenter/callcenter.routes').then((m) => m.callcenterRoutes)
  },
  {
    path: 'discounts',
    loadChildren: () => import('./features/discounts/discounts.routes').then((m) => m.discountsRoutes)
  },
  {
    path: 'asep_bot',
    loadChildren: () => import('./features/asep-bot/asep-bot.routes').then((m) => m.asepBotRoutes)
  },
  {
    path: 'lawyers/case_stages',
    loadChildren: () => import('./features/case-stages/case-stages.routes').then((m) => m.caseStagesRoutes)
  },
  {
    path: 'lawyers',
    loadChildren: () => import('./features/lawyers/lawyers.routes').then((m) => m.lawyersRoutes)
  },
  {
    path: 'postukr',
    loadChildren: () => import('./features/postukr/postukr.routes').then((m) => m.postUkrRoutes)
  },
  {
    path: 'electronic-court',
    loadChildren: () => import('./features/electronic-court/electronic-court.routes').then((m) => m.electronicCourtRoutes)
  },
  {
    path: 'nks-errors',
    loadChildren: () => import('./features/nks-errors/nks-errors.routes').then((m) => m.nksErrorsRoutes)
  },
  {
    path: 'opencourt',
    loadChildren: () => import('./features/open-court/open-court.routes').then((m) => m.openCourtRoutes)
  },
  {
    path: 'req-check',
    loadChildren: () => import('./features/req-check/req-check.routes').then((m) => m.reqRoutes)
  },
  {
    path: 'quality-control',
    loadChildren: () => import('./features/quality-control/quality-control.routes').then((m) => m.qualityRoutes)
  },
  {
    path: 'private_entrepreneurs',
    loadChildren: () => import('./features/private-entrepreneurs/private-entrepreneurs.routes').then((m) => m.peRoutes)
  },
  {
    path: 'ep_dashboards',
    loadChildren: () => import('./features/ep-dashboards/ep-dashboards.routes').then((m) => m.epDashboardRoutes)
  },
  {
    path: 'verdict-sheets',
    loadChildren: () => import('./features/verdict-sheets/verdict-sheets.routes').then((m) => m.verdictSheetsRoutes)
  },
  {
    path: 'documentation-table',
    loadChildren: () => import('./features/documentation/documentation.routes').then((m) => m.documentationRoutes),
    title: 'Ljrevtynfwbz'
  },

  {
    path: '**',
    loadComponent: () => import('./shared/components/page-404/page404.component').then((m) => m.Page404Component),
    title: 'Сторінка не знайдена'
  },
]
