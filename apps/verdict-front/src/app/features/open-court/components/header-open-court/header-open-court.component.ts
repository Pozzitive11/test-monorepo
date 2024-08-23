import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CourtDataService } from '../../services/court-data.service';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';

@Component({
  selector: 'app-header-open-court',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-open-court.component.html',
  styleUrls: ['./header-open-court.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderOpencourtComponent implements OnInit {
  activeTab: 'main' | 'execute-proceedings' = 'main';
  notificationCount: number = 0;
  showPersonalCabinet = false;

  constructor(
    private router: Router,
    private courtDataService: CourtDataService
  ) {}

  private authService = inject(AuthService);

  get username(): string {
    return this.authService.loadedUser?.username || 'Гість';
  }

  get firstLetter(): string {
    return this.username.charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  goToMessages() {
    this.router.navigate(['/opencourt/personal_cabinet/my_cases']);
  }

  togglePersonalCabinet() {
    this.showPersonalCabinet = !this.showPersonalCabinet;
  }

  goToPersonalCabinet() {
    this.router.navigate(['/opencourt/personal_cabinet/event_calendar']);
  }

  goToSettings() {
    this.router.navigate(['/opencourt/personal_cabinet/settings']);
  }

  setActiveTab(tab: 'main' | 'execute-proceedings'): void {
    this.activeTab = tab;
  }

  fetchNotifications(): void {
    this.courtDataService.getCourtEvents().subscribe(
      (response) => {
        this.notificationCount = response.length;
      },
      (error) => {
        console.error('Error fetching court events:', error);
      }
    );
  }
}
