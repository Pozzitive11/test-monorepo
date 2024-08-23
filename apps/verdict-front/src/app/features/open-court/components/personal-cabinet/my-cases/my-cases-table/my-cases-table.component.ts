import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { CourtCardsComponent } from '../../../court-cards/court-cards.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadService } from '../../../court-cards/file-upload.service';
import { TemplateModalComponent } from '../../../template-modal/template-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FullCourtCard,
  MiniCourtCard,
} from '../../../../models/court-cards.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { ConfirmationDialogComponent } from '../../../../confirmation-dialog/confirmation-dialog.component';
import {
  UserCasesType,
  CourtDataService,
} from '../../../../services/court-data.service';

@Component({
  selector: 'app-my-cases-table',
  standalone: true,
  templateUrl: './my-cases-table.component.html',
  styleUrls: ['./my-cases-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
    NgbModule,
    MatDialogModule,
    MatTooltipModule,
  ],
})
export class MyCasesTableComponent implements OnInit {
  private readonly modalService = inject(NgbModal);
  @ViewChild('elementToScrollTo') elementToScrollTo: ElementRef;
  caseNumberIds: number[] = [];
  courtData: FullCourtCard[] = [];
  showInfoBanner = true;
  selectedSortField: string = 'date';
  ascendingSort: boolean = true;
  selectedTask: string = '';
  selectedDecision: string = '';
  uploadedFiles: FileList | null = null;
  meetingDateTime: string = '';
  commentInput: string = '';
  selectedTemplate: string = '';
  showActions: boolean = false;
  subscriptionTracking: { [key: number]: boolean } = {};
  i: number = 0;
  notifications: { [key: number]: any[] } = {};
  selectedActionId: number | null = null;
  userCases: UserCasesType[] = [];
  searchQuery: string = '';
  userEvents: any[] = [];
  actions: any[] = [];
  eventData: any = {
    typeDescriptionId: 0,
    name: '',
    link: '',
    statusName: '',
    eventDate: '',
    text: '',
    subscriptionId: 0,
  };
  filteredCourtData: any[] = [];
  selectedAction: any;
  fileToUpload: File | null = null;
  public noCasesFound: boolean = false;
  sortState = {
    date: 'asc',
    type: 'asc',
  };
  court: any;
  currentCourt: any;
  @ViewChild('tagPopover', { static: false }) tagPopover: NgbPopover;
  @ViewChild('panel') panel: MatExpansionPanel;

  isPanelOpen = false;
  toggleTagPopover(court: any) {
    this.currentCourt = court;
  }

  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;
  expandedPanelId: string | null = null;
  instances: { instance_code: number; uk_name: string }[] = [];
  documentTypes: { judgment_code: number; name: string }[] = [];
  templateData: any = {};
  showModal: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private fileUploadService: FileUploadService,
    private router: Router,
    private messageService: MessageHandlingService,
    public dialog: MatDialog,
    private courtDataService: CourtDataService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}
  get nonDeletedFiles() {
    return this.court.userCase.files.filter(
      (file: { deletedAt: any }) => !file.deletedAt
    );
  }
  ngOnInit(): void {
    this.loadCaseNumberIds();
    this.loadSubscriptionTypeDescriptions();
    this.loadAllNotifications();
    this.loadInstances();
    this.loadDocumentTypes();
  }
  ngAfterViewInit() {
    this.panels.changes.subscribe((panels: QueryList<MatExpansionPanel>) => {
      panels.forEach((panel) => {
        if (panel.id === this.expandedPanelId && panel.expanded) {
          this.scrollToElement();
        }
      });
    });
  }
  loadInstances(): void {
    this.courtDataService.getInstances().subscribe((data) => {
      this.instances = data;
    });
  }
  loadDocumentTypes(): void {
    this.courtDataService.getDocumentTypes().subscribe((data) => {
      this.documentTypes = data;
    });
  }
  scrollToElement(): void {
    setTimeout(() => {
      // Получаем нативный элемент, к которому нужно прокрутить
      const panelContentElement = this.elementRef.nativeElement.querySelector(
        '.notification-wrapper'
      ); // Замените на ваш селектор

      if (panelContentElement) {
        panelContentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100); // Увеличьте задержку, если необходимо
  }

  closeInfoBanner() {
    this.showInfoBanner = false;
  }
  onButtonClick(event: Event): void {
    if (this.isPanelOpen) {
      event.stopPropagation();
    } else {
      this.panel.open();
    }
  }

  panelOpened(): void {
    this.isPanelOpen = true;
  }

  panelClosed(): void {
    this.isPanelOpen = false;
  }

  private loadCaseNumberIds(): void {
    this.spinner.show();
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
          this.spinner.hide();
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

        this.spinner.hide();
        this.loadAllNotifications();
        this.searchCases();
        console.log('Received data:', this.courtData);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching court data:', error);
      }
    );
  }

  toggleNotifications(court: any): void {
    court.showNotifications = !court.showNotifications;
  }
  private loadAllNotifications(): void {
    for (let court of this.courtData) {
      if (court.userCase) {
        this.loadUserEventHistory(court.userCase.id, court, true);
      } else {
      }
    }
  }

  private loadUserEventHistory(
    subscriptionId: number,
    court: any,
    showNotifications: boolean
  ): void {
    const startDate = '2022-05-05';
    const endDate = '2024-06-05';

    this.courtDataService
      .getUsersEventHistory(subscriptionId, startDate, endDate)
      .subscribe(
        (response) => {
          court.notifications = response.map(
            (event: {
              id: any;
              eventDate: string;
              typeDescription: string;
              text: string;
              createdBy: boolean;
            }) => ({
              date: event.eventDate,
              type: event.typeDescription,
              description: event.text,
              id: event.id,
              createdBy: event.createdBy,
            })
          );
          this.courtDataService.setNotifications(response);
          if (showNotifications) {
            court.showNotifications = false;
          }
        },
        (error) => {
          console.error('Error fetching user events:', error);
        }
      );
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
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

  toggleActions(court: any): void {
    court.showActions = !court.showActions;
  }

  toggleEdit(court: FullCourtCard) {
    court.isEditing = !court.isEditing;
    this.showActions = court.isEditing;
  }

  unsubscribeFromCaseById(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Підтвердіть дію',
        message: 'Ви впевнені, що хочете відписатися від справи?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.courtDataService.unsubscribeFromCase(id).subscribe(
          (response) => {
            console.log('Отписка от дела прошла успешно');
            this.spinner.hide();
            // Обновить данные после отписки
            window.location.reload();
          },
          (error) => {
            console.error('Произошла ошибка при отписке от дела:', error);
            this.spinner.hide();
          }
        );
      }
    });
  }

  toggleAccordion(court: any) {
    this.expandedPanelId = court.id;
    court.isExpanded = !court.isExpanded;
  }

  searchCases(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredCourtData = [...this.courtData];
    } else {
      this.filteredCourtData = this.courtData.filter(
        (court) =>
          court.caseNumber
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          (court.userCase &&
            court.userCase.tag &&
            court.userCase.tag
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()))
      );
    }
  }

  updateTag(caseId: number, newTag: string) {
    console.log(
      'Trying to update tag for caseId:',
      caseId,
      'with newTag:',
      newTag
    );
    const userCase = this.userCases.find((uc) => uc.id === caseId);
    if (userCase) {
      console.log('Found userCase:', userCase);
      this.courtDataService.updateCaseTag(userCase.id, newTag).subscribe(
        (response) => {
          console.log('Tag updated successfully', response);
          userCase.tag = newTag;
          this.messageService.sendInfo(`Тег "${newTag}" успішно оновлено.`);
        },
        (error) => {
          console.error('Error updating tag', error);
        }
      );
    } else {
      console.error('Case not found for id:', caseId);
    }
  }
  deleteTag(caseId: number) {
    this.courtDataService.deleteTag(caseId).subscribe(
      (response) => {
        console.log('Tag deleted successfully', response);
        this.messageService.sendError(`Тег успішно видалено.`);
      },
      (error) => {
        console.error('Error deleting tag', error);
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
  uploadFile(court: FullCourtCard): void {
    if (!court.fileToUpload) {
      console.error('Файл не выбран.');
      return;
    }

    console.log('Выбранный файл:', court.fileToUpload.name);

    // Преобразование типа для instanceId и judgmentFormId, если они не определены
    const instanceId = court.instance ? Number(court.instance) : 0; // Используем 0, если instance не определено
    const judgmentFormId = court.documentType ? Number(court.documentType) : 0; // Используем 0, если documentType не определено

    // Вызов метода uploadFile с правильными аргументами
    this.courtDataService
      .uploadFile(
        court.fileToUpload,
        court.userCase.id,
        instanceId,
        judgmentFormId,
        court.filenameInput
      )
      .subscribe(
        (response) => {
          console.log('Файл успешно загружен:', response);
          this.messageService.sendInfo(
            `Файл "${
              court.filenameInput || court.fileToUpload.name
            }" успішно завантажено.`
          );
          window.location.reload();
        },
        (error) => {
          console.error('Ошибка загрузки файла:', error);
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
  navigateToStartPage(): void {
    this.router.navigate(['/opencourt']);
  }
  cancelEdit(comment: any) {
    comment.isEditing = false;
  }
  openEditComment(comment: any) {
    comment.updatedComment = comment.comment; // Установка начального значения для редактирования
    comment.isEditing = true; // Установка флага редактирования
  }
  sortNotifications(court: UserCasesType, column: 'date' | 'type'): void {
    const sortOrder = this.sortState[column] === 'asc' ? 'desc' : 'asc';
    this.sortState[column] = sortOrder;

    court.notifications.sort((a: any, b: any) => {
      if (column === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });
  }
  openTemplateModal(): void {
    // Получение текущей даты
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = this.getMonthName(currentDate.getMonth() + 1); // Месяцы в JavaScript начинаются с 0
    const currentYear = currentDate.getFullYear();
    const courtData = this.courtData[0];

    this.templateData = {
      to_court: courtData.courtName || '',
      judge: courtData.judge || '',
      case_number: courtData.caseNumber || '',
      plaintiff:
        courtData.plaintiff?.map((person) => person.NAME).join(', ') || '',
      claim_from:
        courtData.plaintiff?.map((person) => person.NAME).join(', ') || '',
      defendant:
        courtData.defendant?.map((person) => person.NAME).join(', ') || '',
      claim_to:
        courtData.defendant?.map((person) => person.NAME).join(', ') || '',
      claim_about: courtData.description || '',
      current_day: currentDay || '',
      current_month: currentMonth || '',
      current_year: currentYear || '',
      applicant: '',
      address: '',
      email: '',
      telephone: '',
      rnokpp: '',
      enforcement: '',
      decision_day: null,
      decision_month: null,
      decision_year: null,
      satisfied_type: '',
      full_name: '',
      templateType: this.templateData.templateType, // Предполагается, что вы уже установили значение templateType
    };

    const dialogRef = this.dialog.open(TemplateModalComponent, {
      width: '900px', // Установим фиксированную ширину
      maxHeight: '80vh', // Ограничим максимальную высоту для удобства прокрутки
      panelClass: 'custom-modal', // Добавим класс для стилизации
      data: this.templateData, // Передаем данные в модальное окно через data
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Модальное окно закрыто');
      // Обработка данных после закрытия модального окна, если нужно
    });
  }
  getMonthName(month: number): string {
    // Словарь для соответствия номера месяца и его названия на украинском языке
    const months: { [key: number]: string } = {
      1: 'січня',
      2: 'лютого',
      3: 'березня',
      4: 'квітня',
      5: 'травня',
      6: 'червня',
      7: 'липня',
      8: 'серпня',
      9: 'вересня',
      10: 'жовтня',
      11: 'листопада',
      12: 'грудня',
    };

    return months[month] || ''; // Возвращает название месяца или пустую строку, если нет совпадения
  }

  createTemplateAndCloseModal(): void {
    if (this.isTemplateDataValid()) {
      switch (this.templateData.templateType) {
        case '1': // Заява про видачу виконавчого листа
          this.createExecutiveLetterTemplate();
          break;
        // Добавьте обработку других типов шаблонов здесь
        default:
          console.error('Неизвестный тип шаблона');
          break;
      }
    } else {
      console.error('Форма не заполнена корректно.');
    }
  }

  createExecutiveLetterTemplate(): void {
    const requestBody = {
      to_court: this.templateData.to_court,
      applicant: this.templateData.applicant,
      address: this.templateData.address,
      email: this.templateData.email,
      telephone: this.templateData.telephone,
      judge: this.templateData.judge,
      case_number: this.templateData.case_number,
      claim_from: this.templateData.claim_from,
      claim_to: this.templateData.claim_to,
      claim_about: this.templateData.claim_about,
      rnokpp: this.templateData.rnokpp,
      enforcement: this.templateData.enforcement,
      decision_day: this.templateData.decision_day,
      decision_month: this.templateData.decision_month,
      decision_year: this.templateData.decision_year,
      satisfied_type: this.templateData.satisfied_type,
      current_day: this.templateData.current_day,
      current_month: this.templateData.current_month,
      current_year: this.templateData.current_year,
      full_name: this.templateData.full_name,
    };

    this.courtDataService.createExecutiveLetterTemplate(requestBody).subscribe(
      (response) => {
        console.log('Шаблон успешно создан:', response);
        this.closeTemplateModal();
      },
      (error) => {
        console.error('Ошибка при создании шаблона:', error);
        // Добавьте логику для обработки ошибки здесь
      }
    );
  }

  isTemplateDataValid(): boolean {
    // Проверка на заполнение всех обязательных полей
    return !!this.templateData.to_court && !!this.templateData.applicant;
    // Добавьте проверки для остальных полей здесь
  }

  closeTemplateModal(): void {
    this.showModal = false;
    this.resetTemplateData();
  }

  resetTemplateData(): void {
    this.templateData = {};
  }
}
