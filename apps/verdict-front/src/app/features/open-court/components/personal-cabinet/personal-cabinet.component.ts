import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExecutiveProceedingsComponent } from '../../executive-proceedings/executive-proceedings.component';
import { MiniCourtCardComponent } from '../court-cards/court-mini-cards/court-mini-cards.component';
import { EventCalendarComponent } from './event-calendar/event-calendar/event-calendar.component';
import { MyCasesTableComponent } from './my-cases/my-cases-table/my-cases-table.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourtDataService } from '../../services/court-data.service';
import { AuthService } from 'apps/verdict-front/src/app/core/services/auth.service';
import { FilterPipe } from 'apps/verdict-front/src/app/shared/pipes/filter.pipe';

@Component({
  selector: 'app-personal-cabinet',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    FormsModule,
    NgFor,
    NgxSpinnerModule,
    MiniCourtCardComponent,
    DatePipe,
    FilterPipe,
    ExecutiveProceedingsComponent,
    CommonModule,
    MyCasesTableComponent,
    EventCalendarComponent,
  ],
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalCabinetComponent {
  private authService = inject(AuthService);
  showPersonalCabinet = false;
  notificationCount: number;
  showNotifications: boolean = false;
  showCourtNotifications: boolean = true;
  showExecutionNotifications: boolean = false;
  courtCaseNumbers: number[] = [];
  courtNotifications: string[] = [];
  executionNotifications: string[] = [];
  get username() {
    return this.authService.loadedUser?.username;
  }
  activeTab: 'my_cases' | 'event_calendar' = 'event_calendar';

  constructor(
    private router: Router,
    private courtDataService: CourtDataService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.firstChild?.url.subscribe((url) => {
      if (url.length > 0) {
        const childPath = url[0].path;
        if (childPath === 'my_cases') {
          this.activeTab = 'my_cases';
        } else if (childPath === 'event_calendar') {
          this.activeTab = 'event_calendar';
        }
      }
    });
    this.fetchNotifications();
  }

  togglePersonalCabinet() {
    this.showPersonalCabinet = !this.showPersonalCabinet;
  }
  goToPersonalCabinet() {
    this.router.navigate(['/opencourt/personal_cabinet']);
  }
  goToMessages() {
    this.router.navigate(['/opencourt/messages']);
  }
  toggleNotifications() {
    this.router.navigate(['/opencourt/personal_cabinet']);
  }
  switchToCourtNotifications() {
    this.showCourtNotifications = true;
    this.showExecutionNotifications = false;
  }

  switchToExecutionNotifications() {
    this.showCourtNotifications = false;
    this.showExecutionNotifications = true;
  }

  switchToMyCases(): void {
    this.router.navigate(['/opencourt/personal_cabinet/my_cases']);
    this.activeTab = 'my_cases';
  }

  switchToEventCalendar(): void {
    this.router.navigate(['/opencourt/personal_cabinet/event_calendar']);
    this.activeTab = 'event_calendar';
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
