import { Routes } from '@angular/router'
import { AuthGuard } from '../../core/guards/auth-guard.service'

export const discountsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dc-discounts-page/dc-discounts-page.component').then((m) => m.DcDiscountsPageComponent),
    canActivate: [AuthGuard],
    title: 'Дисконти і реструктуризація',
    children: [
      {
        path: 'login',
        loadComponent: () => import('../../shared/components/auth/auth.component').then((m) => m.AuthComponent),
        title: 'Вхід'
      },
      {
        path: '',
        loadComponent: () =>
          import('./pages/dc-nks-requests/dc-nks-requests.component').then((m) => m.DcNksRequestsComponent),
        // import('./components/dc-info-container/dc-info-container.component').then((m) => m.DcInfoContainerComponent),

        canActivate: [AuthGuard],
        title: 'Дисконти і реструктуризація'
      },
      {
        path: 'military_docs',
        loadComponent: () =>
          import('./pages/dc-military-docs-page/dc-military-docs-page.component').then(
            (m) => m.DcMilitaryDocsPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Облік документів військових'
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/dc-search-page/dc-search-page.component').then((m) => m.DcSearchPageComponent),
        canActivate: [AuthGuard],
        title: 'Пошук узгоджень'
      },
      {
        path: 'sending_docs',
        loadComponent: () =>
          import('./pages/dc-sending-docs-page/dc-sending-docs-page.component').then(
            (m) => m.DcSendingDocsPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Відправка документів'
      },
      {
        path: 'nks-requests',
        loadComponent: () =>
          import('./pages/dc-nks-requests/dc-nks-requests.component').then((m) => m.DcNksRequestsComponent),
        canActivate: [AuthGuard],
        title: 'Запити по НКС'
      },
      {
        path: 'closing-certificates',
        loadComponent: () =>
          import('./pages/dc-closing-certificates-page/dc-closing-certificates-page.component').then(
            (m) => m.DcClosingCertificatesPageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Довідки про закриття'
      },
      {
        path: 'promotions_table',
        loadComponent: () =>
          import('./pages/dc-promotions-table-page/dc-promotions-table-page.component').then(
            (m) => m.DcPromotionsTablePageComponent
          ),
        canActivate: [AuthGuard],
        title: 'Таблиця узгоджень',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/dc-promotions-table-wrapper/dc-promotions-table-wrapper.component').then(
                (m) => m.DcPromotionsTableWrapperComponent
              ),
            title: 'Таблиця узгоджень',
            canActivate: [AuthGuard],
            pathMatch: 'full'
          },
          {
            path: 'templates',
            loadComponent: () =>
              import('./pages/dc-template-documents-page/dc-template-documents-page.component').then(
                (m) => m.DcTemplateDocumentsPageComponent
              ),
            canActivate: [AuthGuard],
            title: 'Таблиця узгоджень | Документи за шаблонами'
          },
          {
            path: 'create_templates',
            loadComponent: () =>
              import('./pages/dc-template-creation-page/dc-template-creation-page.component').then(
                (m) => m.DcTemplateCreationPageComponent
              ),
            canActivate: [AuthGuard],
            title: 'Таблиця узгоджень | Створення документів'
          },
          {
            path: 'requests',
            loadComponent: () =>
              import('./pages/dc-promotions-docs-requests-page/dc-promotions-docs-requests-page.component').then(
                (m) => m.DcPromotionsDocsRequestsPageComponent
              ),
            canActivate: [AuthGuard],
            title: 'Таблиця узгоджень | Запити на створення документів'
          }
        ]
      },
      {
        path: 'long_requests',
        loadChildren: () => import('../long-requests/long-requests.routes').then((m) => m.longRequestsRoutes)
      },
      {
        path: 'info',
        loadComponent: () =>
          import('./components/dc-info-container/dc-info-container.component').then((m) => m.DcInfoContainerComponent),
        canActivate: [AuthGuard],
        title: 'Дисконти і реструктуризація'
      }
    ]
  }
]
