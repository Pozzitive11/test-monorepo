import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard.service';

export const caseStagesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./case-stages.component').then((m) => m.CaseStagesComponent),
    title: 'Стадії розгляду справ',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/pivot-tables/pivot-tables.component').then(
            (m) => m.PivotTablesComponent
          ),
      },

      {
        path: 'table/total/:name',
        loadComponent: () =>
          import('./components/case-table/case-table.component').then(
            (m) => m.CaseTableComponent
          ),
        canActivate: [AuthGuard],
        title: 'Детальна таблиця',
      },
      {
        path: 'table/max/:name',
        loadComponent: () =>
          import('./components/case-stages-max/case-stages-max.component').then(
            (m) => m.CaseStagesMaxComponent
          ),
        canActivate: [AuthGuard],
        title: 'Детальна таблиця',
      },
    ],
  },
];
