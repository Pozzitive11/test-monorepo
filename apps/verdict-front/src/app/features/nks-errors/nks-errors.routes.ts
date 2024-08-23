import { Routes } from '@angular/router'
import { NksErrorsMainPageComponent } from './pages/nks-errors-main-page/nks-errors-main-page.component'

export const nksErrorsRoutes: Routes = [
  {
    path: '',
    component: NksErrorsMainPageComponent,
    title: 'Помилки в НКС'
  }
]
