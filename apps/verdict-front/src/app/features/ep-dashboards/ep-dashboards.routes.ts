import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const epDashboardRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    title: 'Звіти ВП',
    loadComponent: () => import('./pages/ed-page/ed-page.component').then((m) => m.EdPageComponent),

    children: [
      {
        path: 'auctions',
        title: 'Звіт по торгам',
        loadComponent: () =>
          import('./pages/ed-auction-report-page.component').then(
            (m) => m.EdAuctionReportPageComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'all_ep',
        title: 'Звіт по всім ВП',
        loadComponent: () =>
          import('./pages/ed-all-ep-report-page.component').then(
            (m) => m.EdAllEpReportPageComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'all_ep_wp',
        title: 'Звіт по ВП наших компаній',
        loadComponent: () =>
          import('./pages/ed-all-ep-reports-wp.component').then(
            (m) => m.EdAllEpReportsWpComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'dept',
        title: 'Звіт по заміні сторони на Депт',
        loadComponent: () =>
          import('./pages/ed-dept-report-page.component').then(
            (m) => m.EdAllEpReportsdeptComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'dfs',
        title: 'Звіт по перепровірці ДФС',
        loadComponent: () =>
          import('./pages/ed-report-dfs.component').then((m) => m.EdAllEpReportsdfsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'describefirst',
        title: 'Черга майна на опрацювання',
        loadComponent: () => import('./pages/ed-describe-first-report-page.component').then(m => m.EdDescribeFirstComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'describesecond',
        title: 'Черга на опис нерухомості',
        loadComponent: () => import('./pages/ed-describe-second-report-page.component').then(m => m.EdDescribeSecondComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'describethird',
        title: 'Черга на опис нерухомості ПВ',
        loadComponent: () => import('./pages/ed-describe-third-report-page.component').then(m => m.EdDescribeThirdComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'describefourth',
        title: 'Черга на опис з обрізкою по сумі',
        loadComponent: () => import('./pages/ed-describe-fourth-report-page.component').then(m => m.EdDescribeFourthComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallyreport',
        title: 'Звіт по фактично виконаним ВП',
        loadComponent: () => import('./pages/ed-actually-report-page.component').then(m => m.EdDescribeActuallyComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallycurator',
        title: 'Звіт по опрацюванню фактично виконаних ВП кураторами',
        loadComponent: () => import('./pages/ed-actually-curator-report-page.component').then(m => m.EdDescribeActuallyCuratorComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallyreasons',
        title: 'Причини завершення ВП',
        loadComponent: () => import('./pages/ed-actually-reasons-report-page.component').then(m => m.EdDescribeActuallyReasonsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'cashflow',
        title: 'Cash flow по торгам',
        loadComponent: () => import('./pages/ed-cash-flow-report-page.component').then(m => m.EdCashFlowComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'sum',
        title: 'Очікувана сума після реалізації з торгів',
        loadComponent: () => import('./pages/ed-sum-report-page.component').then(m => m.EdSumComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        title: 'Платежі після заяви в суд',
        loadComponent: () => import('./pages/ed-payments-report-page.component').then(m => m.EdPaymentsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'refunds',
        title: 'Повернені кошти по зупиненим,завершеним,негативним рішення і скасуванню ВНН',
        loadComponent: () => import('./pages/ed-refunds-report-page.component').then(m => m.EdRefundsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'wpwk',
        title: 'Платежі після заміни у ВП на ВК',
        loadComponent: () => import('./pages/ed-wp-wk-report-page.component').then(m => m.EdWpWkComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'wpdept',
        title: 'Платежі після заміни у ВП на Дебт',
        loadComponent: () => import('./pages/ed-wp-dept-report-page.component').then(m => m.EdWpDeptComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'wpfop',
        title: 'Платежі після заміни у ВП на ФОП',
        loadComponent: () => import('./pages/ed-wp-fop-report-page.component').then(m => m.EdWpFopComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'avans',
        title: 'Звіт по поверненню авансових внесків',
        loadComponent: () => import('./pages/ed-avans-report-page.component').then(m => m.EdAvansComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'slreport',
        title: 'Звіт по виконаним угодам для СЛ і закриття ВП',
        loadComponent: () => import('./pages/ed-sl-report-page.component').then(m => m.EdSlComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'factslreport',
        title: 'Звіт по фактично виконаним ВП для СЛ і закриття ВП',
        loadComponent: () => import('./pages/ed-fact-sl-report-page.component').then(m => m.EdFactSlComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'describefirst',
        title: 'Черга майна на опрацювання',
        loadComponent: () =>
          import('./pages/ed-describe-first-report-page.component').then(
            (m) => m.EdDescribeFirstComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'describesecond',
        title: 'Черга на опис нерухомості',
        loadComponent: () =>
          import('./pages/ed-describe-second-report-page.component').then(
            (m) => m.EdDescribeSecondComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'describethird',
        title: 'Черга на опис нерухомості ПВ',
        loadComponent: () =>
          import('./pages/ed-describe-third-report-page.component').then(
            (m) => m.EdDescribeThirdComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'describefourth',
        title: 'Черга на опис з обрізкою по сумі',
        loadComponent: () =>
          import('./pages/ed-describe-fourth-report-page.component').then(
            (m) => m.EdDescribeFourthComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallyreport',
        title: 'Звіт по фактично виконаним ВП',
        loadComponent: () =>
          import('./pages/ed-actually-report-page.component').then((m) => m.EdDescribeActuallyComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallycurator',
        title: 'Звіт по опрацюванню фактично виконаних ВП кураторами',
        loadComponent: () =>
          import('./pages/ed-actually-curator-report-page.component').then((m) => m.EdDescribeActuallyCuratorComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'actuallyreasons',
        title: 'Причини завершення ВП',
        loadComponent: () =>
          import('./pages/ed-actually-reasons-report-page.component').then((m) => m.EdDescribeActuallyReasonsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'auctionnot',
        title: '3/4 торги які не відбулися',
        loadComponent: () =>
          import('./pages/ed-auction-not-report-page.component').then(
            (m) => m.EdAuctionNotComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'auctionpriority',
        title: 'Черга на опис майна пріоритетні',
        loadComponent: () =>
          import('./pages/ed-priority-report-page.component').then(
            (m) => m.EdPriorityComponent
          ),
        canActivate: [AuthGuard]
      }

    ]
  }
]
