import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Notification {
  title: string;
  content: string;
  time: string;
}
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgClass,NgIf,NgFor],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;
  selectedTab: 'all' | 'court' | 'executive' = 'all';
  selectedCategory: 'inbox' | 'marked' | 'scheduled' | 'sent' = 'inbox';

  constructor() {
    // Генерация случайных уведомлений для каждой категории
    for (let i = 1; i <= 10; i++) {
      this.notifications.push({
        title: `Уведомление ${i}`,
        content: `Содержание уведомления ${i}`,
        time: this.randomTime()
      });
    }
  }

  randomTime(): string {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  filterNotifications(filter: 'all' | 'unread') {
    // Код фильтрации уведомлений по выбранному фильтру
  }

  showDetails(notification: Notification) {
    this.selectedNotification = notification;
  }

  selectCategory(category: 'inbox' | 'marked' | 'scheduled' | 'sent') {
    this.selectedCategory = category;
  }

  selectTab(tab: 'all' | 'court' | 'executive') {
    this.selectedTab = tab;
  }
}