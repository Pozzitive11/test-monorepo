import { Routes } from '@angular/router'
import { UserInfoDisplayComponent } from './components/personal-cabinet/settings/user-info-display.component'

export const openCourtRoutes: 
  
  Routes = [
    {
      path: '',
      title: 'Open Court',
      loadComponent: () => import('./open-court.component').then((m) => m.OpenCourtComponent),
    },
    {
      path: 'personal_cabinet',
      title: 'Особистий кабінет',
      loadComponent: () => import('./components/personal-cabinet/personal-cabinet.component').then((m) => m.PersonalCabinetComponent),
      children: [
        {
          path: 'my_cases',
          title: 'My Cases',
          loadComponent: () => import("./components/personal-cabinet/my-cases/my-cases-table/my-cases-table.component").then((m) => m.MyCasesTableComponent),
        },
        {
          path: 'event_calendar',
          title: 'Event Calendar',
          loadComponent: () => import("./components/personal-cabinet/event-calendar/event-calendar/event-calendar.component").then((m) => m.EventCalendarComponent),
        },
        {
          path: 'settings',
          title: 'Налаштування',
          loadComponent: () => import('./components/personal-cabinet/settings/settings.component').then((m) => m.SettingsComponent),
        },
        {
          path: 'user-info',
          title: 'Моя інформація',
          component: UserInfoDisplayComponent
        },
        { path: '', redirectTo: 'my_cases', pathMatch: 'full' } 
      ]
    },
        {
           path: 'messages', 
           title: 'Повідомлення',
           loadComponent: () => import("./components/messages/messages.component").then((m) => m.MessagesComponent)
            },
            {
              path: 'personal_cabinet_mycases', 
              title: 'Повідомлення',
              loadComponent: () => import("./components/personal-cabinet/my-cases/my-cases-table/my-cases-table.component").then((m) => m.MyCasesTableComponent)
               }
        
      ]
    
  
  

