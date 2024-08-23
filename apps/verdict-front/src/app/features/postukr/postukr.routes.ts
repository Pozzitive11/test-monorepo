import { Routes } from '@angular/router';
import { PostukrComponent } from './postukr.component';
import { PostReestrComponent } from './pages/post-reestr/post-reestr.component';
import { PostPageComponent } from './pages/post-first-screen/post-first-screen.component';
import { PostEditingShipmentsComponent } from './pages/post-editing-shipments/post-editing-shipments.component';
import { PostTrackingShipmentsComponent } from './pages/post-tracking-shipments/post-tracking-shipments.component';
import { PostUkrShowReestrComponent } from './pages/post-ukr-show-reestr/post-ukr-show-reestr.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';

export const postUkrRoutes: Routes = [
  {
    path: '',
    component: PostPageComponent,
    children: [
      {
        path: '',
        component: PostukrComponent,
        canActivate: [AuthGuard],
        title: 'Укрпошта',
      },
      {
        path: 'post-reestr',
        component: PostReestrComponent,
        canActivate: [AuthGuard],
        title: 'Реєстр',
      },
      {
        path: 'post-editing-shipments',
        component: PostEditingShipmentsComponent,
        canActivate: [AuthGuard],
        title: 'Редагування відправлень',
      },
      {
        path: 'post-tracking-shipments',
        component: PostTrackingShipmentsComponent,
        canActivate: [AuthGuard],
        title: 'Відстеження відправлень',
      },
      {
        path: 'post-ukr-show-reestr',
        component: PostUkrShowReestrComponent,
        canActivate: [AuthGuard],
        title: 'Перегляд реєстрів',
      },
    ],
  },
];
