import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarMonthViewDay,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { CommonModule, registerLocaleData } from '@angular/common';
import { endOfDay, startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import {
  NgbModal,
  NgbPopover,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { EventColor } from 'calendar-utils';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import localeUk from '@angular/common/locales/uk';
import { CustomDateFormatter } from '../custom-date-formatter';
import { CourtCardsComponent } from '../../../court-cards/court-cards.component';
import { CustomDatePipe } from './custom-date.pipe';
import { CustomWeekDatePipe } from './custom-date-week.pipe';
import { CustomMonthDatePipe } from './custom-date-mounth.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  CourtDataService,
  UserCasesType,
} from '../../../../services/court-data.service';
import {
  FullCourtCard,
  MiniCourtCard,
} from '../../../../models/court-cards.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

registerLocaleData(localeUk);

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
interface CustomCalendarEvent<T = any> extends CalendarEvent<T> {
  subscriptionId?: number;
  courtData?: any;
}
interface CustomCalendarMonthViewDay extends CalendarMonthViewDay {
  eventGroups?: [string, CalendarEvent<any>[]][];
}

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter }, //
  ],
  imports: [
    FlatpickrModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    NgbPopoverModule,
    CustomDatePipe,
    CustomWeekDatePipe,
    CustomMonthDatePipe,
    MatIconModule,
    MatButtonModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./event-calendar.component.css'],
  templateUrl: './event-calendar.component.html',
})
export class EventCalendarComponent implements AfterViewInit {
  @ViewChild('dayView', { static: false }) dayView: CalendarDayViewComponent;
  @ViewChild('popoverContent') popoverContent: TemplateRef<any>;
  @ViewChild('p') p: NgbPopover;
  viewDateEnd: Date = new Date();
  @Output() addEventToCalendarEvent: EventEmitter<{
    title: string;
    startDateTime: Date;
    endDateTime: Date;
  }> = new EventEmitter();
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  selectedDecision: string;
  selectedAction: string = '';
  calendarDays: any[] = [];
  meetingDateTime: Date;
  commentInput: string;
  selectedTask: string;
  selectedTemplate: string;
  showActions: boolean = false;
  uploadedFiles: FileList | null = null;
  view: CalendarView = CalendarView.Day;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  court: any;
  popoverContentTemplate = false;
  courtData: FullCourtCard[] = [];
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: any[] = [];
  refresh = new Subject<void>();
  events: CustomCalendarEvent[] = [];
  selectedActionId: number | null = null;
  eventData: any = {
    typeDescriptionId: 0,
    name: '',
    link: '',
    statusName: '',
    eventDate: '',
    text: '',
    subscriptionId: 0,
  };
  clickEventX: number = 0;
  clickEventY: number = 0;
  activeDayIsOpen: boolean = true;
  selectedCaseNumberId: number | null = null;
  caseNumberIds: number[] = [];
  userCases: UserCasesType[] = [];
  selectedCaseNumber: string;
  isPopoverOpen: boolean = false;
  public noCasesFound: boolean = false;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  groupedEvents: any[] = [];
  selectedMiniCourtData: MiniCourtCard;
  id: string;

  constructor(
    private messageService: MessageHandlingService,
    private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private modal: NgbModal,
    private courtDataService: CourtDataService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCaseNumberIds();
    this.loadEvents();

    this.loadSubscriptionTypeDescriptions();
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  formattedDate() {
    const day = this.viewDate.getDate();
    const monthIndex = this.viewDate.getMonth() + 1;
    const year = this.viewDate.getFullYear();
    return `${day}.${monthIndex < 10 ? '0' : ''}${monthIndex}.${year}`;
  }
  private loadCaseNumberIds(): void {
    this.courtDataService.getUsersCases().subscribe(
      (userCases) => {
        if (userCases && userCases.length > 0) {
          this.caseNumberIds = userCases.map(
            (userCase: UserCasesType) => userCase.caseNumberId
          );
          this.userCases = userCases;
          this.noCasesFound = false;
          console.log('User cases found:', this.caseNumberIds);
          this.loadCourtData();
        } else {
          this.noCasesFound = true;
          console.error('No user cases received.');
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.noCasesFound = true;
        console.error('Error fetching user cases:', error);
        this.cdr.detectChanges();
      }
    );
  }
  private loadCourtData(): void {
    const searchCriteria = {
      case_ids: this.caseNumberIds,
      case_numbers: [],
      court_numbers: [],
      judge_names: [],
      region_codes: [],
      all_participants: [],
      plaintiffs: [],
      plaintiffs_types: [],
      defendants: [],
      defendants_types: [],
      third_persons: [],
      third_persons_types: [],
      appellants: [],
      appellants_types: [],
      cassants: [],
      cassants_types: [],
      descriptions: [],
      case_types: [],
      start_date: null,
      end_date: null,
      start_sum: null,
      end_sum: null,
    };
    console.log('Search Criteria:', searchCriteria);
    this.courtDataService.getCourtData(searchCriteria).subscribe(
      (data) => {
        this.courtData = data;
        this.courtData = this.courtData.map((court) => {
          const userCase = this.userCases.find(
            (userCase) => userCase.caseNumberId === court.id
          );

          return {
            ...court,
            showNotifications: false,
            userCase: userCase as UserCasesType,
          };
        });
        this.events = this.events.map((event) => {
          const courtData = this.courtData.find(
            (court) => court.id === event.subscriptionId
          );
          if (courtData) {
            event.courtData = courtData;
          }
          return event as CustomCalendarEvent;
        });
        console.log('Received data:', this.courtData);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching court data:', error);
      }
    );
  }
  private loadSubscriptionTypeDescriptions(): void {
    this.courtDataService.getSubscriptionTypeDescriptions().subscribe(
      (response) => {
        this.actions = response;
      },
      (error) => {
        console.error('Error fetching subscription type descriptions:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    const calTimeElements = document.getElementsByClassName('cal-time');
    if (calTimeElements && calTimeElements.length > 0) {
      const scrollbar = calTimeElements[16] as HTMLElement;
      scrollbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  loadEvents(): void {
    this.courtDataService.getCourtEvents().subscribe((response) => {
      console.log('Received events:', response);

      const newEvents: CalendarEvent[] = response.map((event: any) => ({
        start: new Date(event.eventDate),
        title: event.text,
        color: event.createdBy ? colors['yellow'] : colors['blue'],
        allDay: false,
        subscriptionId: event.subscriptionId,
        draggable: true,
        id: event.id,
        meta: {
          type: 'event',
        },
      }));
      this.userCases.forEach((userCase) => {
        userCase.comments.forEach(
          (comment: {
            createdAt: string | number | Date;
            comment: any;
            id: any;
          }) => {
            newEvents.push({
              start: new Date(comment.createdAt),
              title: `Комментарий: ${comment.comment}`,
              color: colors['blue'],
              allDay: true,
              draggable: false,
              id: comment.id,
              meta: {
                type: 'comment',
              },
            });
          }
        );
      });

      console.log('Processed events:', newEvents);

      // Группировка событий по типу
      const groupedEvents: CalendarEvent[] = [];
      const processedEvents = new Set();
      newEvents.forEach((event) => {
        if (!processedEvents.has(event)) {
          const similarEvents = newEvents.filter((otherEvent) =>
            this.isSimilarEvent(event, otherEvent)
          );
          similarEvents.forEach((e) => processedEvents.add(e));
          if (similarEvents.length > 1) {
            groupedEvents.push({
              title: `${similarEvents.length} события`,
              start: event.start,
              end: event.end,
              color: event.color,
              meta: {
                groupedEvents: similarEvents,
              },
            });
          } else {
            groupedEvents.push(event);
          }
        }
      });
      console.log('Grouped events:', groupedEvents);
      this.events = groupedEvents;
      this.refresh.next();
    });
  }

  onEventTimesChanged({
    event,
    newStart,
  }: CalendarEventTimesChangedEvent): void {
    if (event.draggable) {
      const subscriptionId: number = Number(event.id);
      const newTitle: string = event.title;

      console.log('Event times changed:', event);

      this.courtDataService
        .updateCourtEvent(subscriptionId, newStart, newTitle)
        .subscribe((response) => {
          console.log('Event updated on server:', response);
          // Обновление события в массиве this.events
          const updatedEventIndex = this.events.findIndex(
            (e) => e.id === subscriptionId
          );
          if (updatedEventIndex !== -1) {
            this.events[updatedEventIndex].start = newStart;
            this.events[updatedEventIndex].title = newTitle;
          }
          this.refresh.next();
        });
    }
  }
  private isSimilarEvent(
    event1: CalendarEvent,
    event2: CalendarEvent
  ): boolean {
    return (
      event1.meta.type === event2.meta.type &&
      event1.start.getTime() === event2.start.getTime()
    );
  }
  beforeMonthViewRender({
    body,
  }: {
    body: CustomCalendarMonthViewDay[];
  }): void {
    body.forEach((cell) => {
      const groups: { [key: string]: CalendarEvent<any>[] } = {};
      cell.events.forEach((event: CalendarEvent<any>) => {
        const eventType = event.meta.type;
        groups[eventType] = groups[eventType] || [];
        groups[eventType].push(event);
      });
      cell.eventGroups = Object.entries(groups);
    });
  }

  openPopover(
    popover: NgbPopover,
    x: number,
    y: number,
    targetHtml: HTMLElement
  ): void {
    if (popover?.isOpen() && popover) {
      popover.close();
    }
    if (popover && !popover.isOpen()) {
      popover.positionTarget = targetHtml;
      popover.open({ courtData: this.courtData });
    }
  }
  getBadgeClass(eventType: string): string {
    switch (eventType) {
      case 'event':
        return 'yellow';
      case 'comment':
        return 'blue';
      default:
        return 'blue';
    }
  }

  closePopover(popover: any): void {
    popover.close();
    this.isPopoverOpen = false;
  }

  dayClicked(
    { day, sourceEvent }: { day: CalendarMonthViewDay<any>; sourceEvent: any },
    popover: NgbPopover
  ): void {
    this.viewDate = day.date;
    this.activeDayIsOpen = !this.activeDayIsOpen && day.events.length > 0;
    const targetHtml = sourceEvent?.target;
    this.openPopover(popover, this.clickEventX, this.clickEventY, targetHtml);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }

  handleEvent(
    eventWrapper: {
      event: CustomCalendarEvent<any>;
      sourceEvent: MouseEvent | KeyboardEvent;
    },
    id: string
  ): void {
    console.log('Event wrapper received:', eventWrapper);

    const event = eventWrapper.event;

    if (!event || !event.subscriptionId) {
      console.error('Event does not contain subscriptionId:', event);
      return;
    }

    const courtId = event.subscriptionId;
    console.log('Subscription ID from event:', courtId);

    const miniCourtData = this.userCases.find(
      (userCase) => userCase.id === courtId
    );
    if (miniCourtData) {
      console.log('Found miniCourtData:', miniCourtData);

      const caseNumberId = miniCourtData.caseNumberId;

      const userCase = this.courtData.find(
        (court) => court.id === caseNumberId
      );

      if (userCase) {
        console.log('Received court data in handleEvent:', userCase);

        // Открываем модальное окно с данными судебного дела
        const modalRef = this.modalService.open(CourtCardsComponent, {
          centered: true,
          backdrop: 'static',
          size: 'xl',
        });
        modalRef.componentInstance.fullCourtData = userCase;
        modalRef.componentInstance.caseNumberId = id;

        // Дополнительные действия после получения данных
      } else {
        console.error('User case not found for event:', event);
      }
    }
  }
  openModal(miniCourtData: MiniCourtCard, id: string): void {
    console.log('Received court data in handleEvent:', miniCourtData);
    console.log('Received ID:', id);
    const modalref = this.modalService.open(CourtCardsComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    modalref.componentInstance.fullCourtData = miniCourtData;
    modalref.componentInstance.caseNumberId = id;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  handleDecision(): void {
    const newEvent: CalendarEvent = {
      start: new Date(),
      title: '',
      color: colors['blue'],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };

    switch (this.selectedDecision) {
      case 'upload':
        if (this.uploadedFiles && this.uploadedFiles.length > 0) {
          newEvent.title = `${this.selectedTask}: Завантаження файлу: ${this.uploadedFiles[0].name}`;
        }
        break;
      case 'meeting':
        if (this.meetingDateTime) {
          newEvent.title = 'Нове засідання';
          newEvent.start = new Date(this.meetingDateTime);
          newEvent.end = new Date(
            new Date(this.meetingDateTime).getTime() + 60 * 60 * 1000
          ); // 1 час заседания
        }
        break;
      case 'comment':
        if (this.commentInput) {
          newEvent.title = `${this.selectedTask}: Коментарій: ${this.commentInput}`;
        }
        break;
      case 'document':
        if (this.selectedTemplate) {
          newEvent.title = `Новий процесуальний документ (${this.selectedTemplate})`;
        }
        break;
      default:
        break;
    }

    if (newEvent.title) {
      this.events = [...this.events, newEvent];
      this.refresh.next();
    }

    this.modal.dismissAll();
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.uploadedFiles = target.files;
  }

  onAddEventToCalendar(
    title: string,
    startDateTime: Date,
    endDateTime: Date
  ): void {
    this.addEventToCalendarEvent.emit({ title, startDateTime, endDateTime });
  }

  addEventToCalendar(
    title: string,
    startDateTime: Date,
    endDateTime: Date
  ): void {
    this.addEventToCalendarEvent.emit({ title, startDateTime, endDateTime });
  }

  saveMeetingDateTime(): void {
    const newEvent: CalendarEvent = {
      title: 'Нове засідання',
      start: startOfDay(this.meetingDateTime),
      end: endOfDay(this.meetingDateTime),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };
    this.events = [...this.events, newEvent];
  }

  externalDrop(event: CalendarEvent): void {
    this.events = [
      ...this.events,
      {
        ...event,
        start: new Date(),
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }
  onActionChange(event: Event, court: any): void {
    const target = event.target as HTMLSelectElement;
    const actionId = Number(target.value);

    if (!isNaN(actionId)) {
      const selectedAction = this.actions.find(
        (action) => action.id === actionId
      );
      if (selectedAction) {
        court.selectedAction = selectedAction;
        this.selectedActionId = actionId;
      }
    }
  }

  createEvent(court: any): void {
    if (court.selectedAction && court.userCase.id && this.eventData.eventDate) {
      const newEvent = {
        typeDescriptionId: court.selectedAction.id,
        name: court.selectedAction.name,
        link: null,
        statusName: '',
        eventDate: this.eventData.eventDate,
        text: court.selectedAction.description,
        subscriptionId: court.userCase.id,
      };

      this.courtDataService.createEvent(newEvent).subscribe(
        (response) => {
          console.log('Event created:', response);
          this.messageService.sendInfo(
            ` ${court.selectedAction.name} успішно створене.`
          );
          this.loadEvents();
          window.location.reload();
          this.refresh.next();
        },

        (error) => {
          console.error('Error creating event:', error);
        }
      );
    } else {
      console.error('Required information is missing');
    }
  }

  editTag(court: any): void {
    court.editingTag = true;
  }
  deleteEvent(eventId: any): void {
    this.courtDataService.deleteUserEvent(eventId).subscribe(
      (response) => {
        console.log('Event deleted successfully:', response);
      },
      (error) => {
        console.error('Error deleting event:', error);
      }
    );
  }
  toggleTagEditing(court: any): void {
    court.isTagEditing = !court.isTagEditing;
  }
  addComment(court: any) {
    const commentPayload = {
      comment: court.commentInput,
      subscriptionId: court.userCase.id,
    };
    this.courtDataService.addComment(commentPayload).subscribe((response) => {
      console.log('Comment added:', response);
    });
  }
  updateComment(court: any, comment: any) {
    this.courtDataService
      .updateComment(comment.id, comment.updatedComment)
      .subscribe(
        (response) => {
          comment.comment = comment.updatedComment;
          comment.isEditing = false;
          console.log('Comment updated:', response);
        },
        (error) => {
          console.error('Error updating comment:', error);
        }
      );
  }
  deleteComment(commentId: number): void {
    this.courtDataService.deleteComment(commentId).subscribe(
      (response) => {
        console.log('Comment deleted:', response);
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  onFileSelected(event: any, court: FullCourtCard): void {
    court.fileToUpload = event.target.files.item(0);
  }
  downloadFile(fileId: number): void {
    this.courtDataService.downloadFile(fileId).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: response.type });
        const fileUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', `file_${fileId}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error: any) => {
        console.error('Error downloading file:', error);
      }
    );
  }
  deleteFile(fileId: number): void {
    this.courtDataService.deleteFile(fileId).subscribe(
      (response: any) => {
        console.log('File deleted successfully:', response);
      },
      (error: any) => {
        console.error('Error deleting file:', error);
      }
    );
  }
}
