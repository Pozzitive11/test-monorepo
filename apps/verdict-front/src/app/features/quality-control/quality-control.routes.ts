import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const qualityRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    title: 'Контроль якості',
    loadComponent: () =>
      import('./pages/quality-main-page/quality-main-page.component').then((m) => m.QualityMainPageComponent),
    children: [
      {
        path: 'quality-control-evaluation',
        canActivate: [AuthGuard],
        title: 'Керування листом оцінювання',
        loadComponent: () =>
          import(
            './pages/quality-management-of-evaluation-sheet/quality-management-of-evaluation-sheet.component'
          ).then((m) => m.QualityManagementOfEvaluationSheetComponent)
      },
      {
        path: 'quality-control-penalty',
        canActivate: [AuthGuard],
        title: 'Керування листом штрафів',
        loadComponent: () =>
          import(
            './pages/quality-report-penalty-sheet-management/quality-report-penalty-sheet-management.component'
          ).then((m) => m.QualityReportPenaltyManagementSheetComponent)
      },
      {
        path: 'edit-row',
        canActivate: [AuthGuard],
        title: 'Редагування',
        loadComponent: () =>
          import('./components/quality-edit-row-table/quality-edit-row-table.component').then(
            (m) => m.QualityEditRowTableComponent
          )
      },
      {
        path: 'add-user',
        canActivate: [AuthGuard],
        title: 'Cтворити користувача',
        loadComponent: () =>
          import('./components/quality-user-add/quality-user-add.component').then((m) => m.QualityUserAddComponent)
      },
      {
        path: 'update-user',
        canActivate: [AuthGuard],
        title: 'Оновити користувача',
        loadComponent: () =>
          import('./components/quality-user-update/quality-user-update.component').then(
            (m) => m.QualityUserUpdateComponent
          )
      },
      // {
      //   path: 'delete-user',
      //   canActivate: [AuthGuard],
      //   title: 'Оновити користувача',
      //   loadComponent: () =>
      //     import('./components/quality-user-delete/quality-user-delete.component').then(
      //       (m) => m.QualityUserDeleteComponent
      //     )
      // },
      {
        path: 'edit-monitoring',
        canActivate: [AuthGuard],
        title: 'Редагувати моніторинг',
        loadComponent: () =>
          import('./components/quality-edit-monitoring/quality-edit-monitoring.component').then(
            (m) => m.QualityEditMonitoringComponent
          )
      },
      {
        path: 'user-row',
        canActivate: [AuthGuard],
        title: 'Користувач',
        loadComponent: () =>
          import('./components/quality-user-view/quality-user-view.component').then((m) => m.QualityUserViewComponent)
      },
      {
        path: 'user-row-edit',
        canActivate: [AuthGuard],
        title: 'Редагування',
        loadComponent: () =>
          import('./components/quality-create-monitoring/quality-create-monitoring.component').then(
            (m) => m.QualityCreateMonitoringComponent
          )
      },
      {
        path: 'remove-user',
        canActivate: [AuthGuard],
        title: 'Видалити',
        loadComponent: () =>
          import('./components/quality-user-remove/quality-user-remove.component').then(
            (m) => m.QualityUserRemoveComponent
          )
      },
      {
        path: 'create-row',
        canActivate: [AuthGuard],
        title: 'Створення',
        loadComponent: () =>
          import('./components/quality-edit-row-new/quality-edit-row-new.component').then(
            (m) => m.QualityEditRowNewComponent
          )
      },
      {
        path: 'quality-control-monitoring',
        canActivate: [AuthGuard],
        title: 'Керування моніторингами',
        loadComponent: () =>
          import('./pages/quality-monitoring-management/quality-monitoring-management.component').then(
            (m) => m.QualityMonitoringManagementComponent
          )
      },
      {
        path: 'quality-control-report',
        canActivate: [AuthGuard],
        title: 'Керування звітами',
        loadComponent: () =>
          import('./pages/quality-report-management/quality-report-management.component').then(
            (m) => m.QualityReportManagementComponent
          )
      },
      {
        path: 'quality-control-user',
        canActivate: [AuthGuard],
        title: 'Керування користувачами',
        loadComponent: () =>
          import('./pages/quality-user-management/quality-user-management.component').then(
            (m) => m.QualityUserManagementComponent
          )
      },
      {
        path: 'quality-calls',
        canActivate: [AuthGuard],
        title: 'Керування дзвінками',
        loadComponent: () =>
          import('./pages/quality-calls-page/quality-calls-page.component').then((m) => m.QualityCallsPageComponent)
      },
      {
        path: 'quality-calls-call',
        canActivate: [AuthGuard],
        title: 'Керування дзвінком',
        loadComponent: () =>
          import('./components/quality-calls/quality-calls-call/quality-calls-call.component').then(
            (m) => m.QualityCallsCallComponent
          )
      },
      {
        path: 'show-edited-monitoring',
        canActivate: [AuthGuard],
        title: 'Відредагований моніторінг',
        loadComponent: () =>
          import('./pages/show-edited-monitoring/show-edited-monitoring.component').then(
            (m) => m.ShowEditedMonitoringComponent
          )
      }
    ]
  }
]
