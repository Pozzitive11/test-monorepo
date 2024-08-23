import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CourtDataService } from '../../services/court-data.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { forkJoin, map, Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgFor, NgIf, MatExpansionModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {
  notifications: any[] = [];
  @Input() caseNumberId: string; // Добавьте свойство для id
  userCases: any[] = [];
  startDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  endDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  casesData: any[] = [];

  constructor(private courtDataService: CourtDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Initializing HistoryComponent');
    this.loadSubscriptionsAndMatchNotifications(this.caseNumberId);
  }

  loadSubscriptionsAndMatchNotifications(caseNumberId: string): void {
    console.log('Loading subscription and matching notifications for caseNumberId:', caseNumberId);

    if (this.userCases.length === 0) {
      this.courtDataService.getUsersCases().subscribe(
        (cases: any[]) => {
          console.log('Loaded user cases:', cases);
          this.userCases = cases;

          this.loadEventHistoryForCase(caseNumberId);
        },
        error => {
          console.error('Error loading user cases:', error);
        }
      );
    } else {
      this.loadEventHistoryForCase(caseNumberId);
    }
  }

  private loadEventHistoryForCase(caseNumberId: string): void {
    const caseData = this.userCases.find(caseItem => caseItem.caseNumberId === caseNumberId);

    if (!caseData) {
      console.error('Case with caseNumberId', caseNumberId, 'not found.');
      return;
    }

    this.courtDataService.getUsersEventHistory(caseData.id, this.startDate, this.endDate).subscribe(
      (events: any[]) => {
        console.log('Loaded events:', events);
        this.notifications = events.filter(event => event.subscriptionId === caseData.id);
        console.log('Filtered notifications:', this.notifications);
        this.cdr.markForCheck();
      },
      error => {
        console.error('Error loading event history:', error);
      }
    );
  }

  matchNotificationsToCases(subscriptions: any[]): void {
    console.log('Matching notifications to cases...');
    const casesData = this.courtDataService.getCasesData();

    subscriptions.forEach(subscription => {
      const subscriptionId = subscription.id;

      const matchingNotifications = this.notifications.filter(notification =>
        notification.subscriptionId === subscriptionId
      );

      console.log(`Matched notifications for Subscription ID ${subscriptionId}:`);
      console.log(matchingNotifications);

      const caseData = casesData.find(caseData => caseData.id === subscription.id);
      if (caseData) {
        caseData.notifications = matchingNotifications;
      }
    });
    this.casesData = casesData;
    console.log('Cases data after matching:', this.casesData);
    this.cdr.markForCheck();
  }
}