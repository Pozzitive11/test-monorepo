import { Component, inject } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import { Router, RouterLink } from '@angular/router'
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'

interface Application {
  title: string
  links: { name: string; url: string }[]
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, RouterLink]
})
export class DashboardComponent {
  authService = inject(AuthService)
  get session_id() {
    return this.authService.loadedUser?.username || ''
  }
  applications: Application[] = [
    {
      title: 'Звіти К1',
      links: [
        { name: 'Дашборд К1', url: 'http://10.11.32.60:8050/' },
        { name: 'Видача кредиту', url: 'http://10.11.32.60:8050/req_check' }
      ]
    },
    {
      title: 'Фінансові звіти',
      links: [{ name: 'Дашборд Фін', url: 'http://10.11.33.15:8050/reports' }]
    },
    {
      title: 'Звіти КЦ',
      links: [
        { name: 'Дашборд КЦ', url: 'callcenter' },
        { name: 'Дисконти', url: 'discounts' },
        { name: 'Скіп К1', url: 'http://10.11.32.60:8080/' }
      ]
    },
    {
      title: 'Роботи для юристів',
      links: [
        { name: 'ГИС-бот', url: 'http://10.11.32.60:8080/' },
        { name: 'Суд-бот', url: 'http://10.11.32.60:8080/' }
      ]
    },
    {
      title: 'Застосунки КЦ',
      links: [
        { name: 'Quality control', url: 'http://10.11.32.57:8080/' },
        { name: 'Рознесення платежів', url: 'purpose_payments' },
        { name: 'Карась', url: 'http://10.11.32.60:8080/' }
      ]
    },
    {
      title: 'Інші застосунки',
      links: [{ name: 'Розбивка часу', url: 'http://10.11.32.57:8000/' }]
    },
    {
      title: 'Звіти з судів',
      links: [{ name: 'Робота юристів', url: 'lawyers/case_stages' }]
    }
  ]
}
