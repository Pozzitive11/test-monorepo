import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const callcenterRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cc-callcenter-page/cc-callcenter-page.component').then((m) => m.CcCallcenterPageComponent),
    children: [
      {
        path: 'SegmentsRPCNC',
        loadComponent: () =>
          import('./pages/cc-segments-rpc-nc-page/cc-segments-rpc-nc-page.component').then(
            (m) => m.CcSegmentsRpcNcPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Сегменти RPC і NC'
      },
      {
        path: 'PhoneSegmentation',
        loadComponent: () =>
          import('./pages/cc-phone-segmentation-page/cc-phone-segmentation-page.component').then(
            (m) => m.CcPhoneSegmentationPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Дії та спроби по номерам'
      },
      {
        path: 'SegmentsRPCNC/info',
        loadComponent: () =>
          import('./pages/cc-segments-rpc-nc-info-table-page/cc-segments-rpc-nc-info-table-page.component').then(
            (m) => m.CcSegmentsRpcNcInfoTablePageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Сегменти RPC і NC, інформація'
      },
      {
        path: 'EverydayCallCenter',
        loadComponent: () =>
          import('./pages/cc-ed-work-page/cc-ed-work-page.component').then((m) => m.CcEdWorkPageComponent),
        canActivate: [AuthGuard],
        title: 'Щоденна робота КЦ'
      },
      {
        path: 'Income',
        loadComponent: () =>
          import('./pages/cc-income-page/cc-income-page.component').then((m) => m.CcIncomePageComponent),
        canActivate: [AuthGuard],
        title: 'Звіт по доходам'
      },
      {
        path: 'IntersectionsINN',
        loadComponent: () =>
          import('./pages/cc-intersections-inn-page/cc-intersections-inn-page.component').then(
            (m) => m.CcIntersectionsInnPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Перетин ІПН'
      },
      {
        path: 'Mails',
        loadComponent: () =>
          import('./pages/cc-mails-report-page/cc-mails-report-page.component').then(
            (m) => m.CcMailsReportPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Звіт з листів'
      },
      {
        path: 'ProjectEPReturns',
        loadComponent: () =>
          import('./pages/cc-project-ep-returns-page/cc-project-ep-returns-page.component').then(
            (m) => m.CcProjectEpReturnsPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Платежі у розрізі проектів та ознаки ВП'
      },
      {
        path: 'TimePlanFact',
        loadComponent: () =>
          import('./pages/cc-time-plan-fact-page/cc-time-plan-fact-page.component').then(
            (m) => m.CcTimePlanFactPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'План/факт за часом'
      },
      {
        path: 'TimePlanFact/uploadPlans',
        loadComponent: () =>
          import('./pages/cc-upload-time-plans-page/cc-upload-time-plans-page.component').then(
            (m) => m.CcUploadTimePlansPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Завантаження планів за часом'
      },
      {
        path: 'Infos',
        loadComponent: () =>
          import('./pages/cc-upload-info/cc-upload-info.component').then((m) => m.CcUploadInfoComponent),
        canActivate: [AuthGuard],
        title: 'Инфо'
      },
      {
        path: 'ProjectMetrics',
        loadComponent: () =>
          import('./pages/cc-dashboard-page/cc-dashboard-page.component').then((m) => m.CcDashboardPageComponent),
        canActivate: [AuthGuard],
        title: 'Метрики по Проєктам'
      },
      {
        path: 'Segmentation',
        loadComponent: () =>
          import('./pages/cc-segmentation-page/cc-segmentation-page.component').then(
            (m) => m.CcSegmentationPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Сегментація'
      },
      {
        path: 'login',
        loadComponent: () => import('../../shared/components/auth/auth.component').then((m) => m.AuthComponent),
        title: 'Вхід'
      }
    ],
    canActivate: [AuthGuard],
    title: 'Звіти КЦ'
  }
]
