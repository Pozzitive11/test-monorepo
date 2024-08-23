import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PlaintiffService } from '../../services/plaintiff.service';
import {
  Decisions,
  FullCourtCard,
  Stage,
  StageData,
  UploadedFile,
  UserCase,
} from '../../models/court-cards.model';
import { DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryComponent } from '../history/history.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap, map } from 'rxjs';
import { CourtDataService } from '../../services/court-data.service';
import { PopoverDirective, PopoverModule } from 'ngx-bootstrap/popover';
import { ConfirmationPopoverComponent } from '../../confirmation-popover/confirmation-popover.component';
import { MyCasesTableComponent } from '../personal-cabinet/my-cases/my-cases-table/my-cases-table.component';
import { FileUploadService } from './file-upload.service';
import { DocumentViewerService } from '../../services/document-viewer.service';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-court-card',
  templateUrl: './court-cards.component.html',
  styleUrls: ['./court-cards.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    FormsModule,
    HistoryComponent,
    PopoverModule,
    ConfirmationPopoverComponent,
    MyCasesTableComponent,
    NgbPopoverModule,
  ],
  providers: [DecimalPipe],
})
export class CourtCardsComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private courtDataService: CourtDataService,
    private messageService: MessageHandlingService,
    public dialog: MatDialog,
    private documentViewerService: DocumentViewerService
  ) {}
  readonly activeModal = inject(NgbActiveModal);
  readonly searchService = inject(PlaintiffService);
  @ViewChild('popover', { static: false }) popover: PopoverDirective;
  popoverTitle: string = '';
  showButtons: boolean;
  popoverMessage: string;

  @Input() fullCourtData: FullCourtCard;
  decisions: Decisions[] = [];
  @Output() searchString = new EventEmitter<string>();
  @Output() openDocument = new EventEmitter<{
    documentType: string;
    documentText: string;
  }>();
  selectedDocumentType: string = '';
  selectedStage: string = 'all';
  activeTab: string = 'main';
  tableView: boolean = false;
  stage: any;
  ascendingSort: boolean = true;
  sortByOptions: string[] = [
    'Датою отримання',
    'Датою Публікації',
    'Датою винесення рішення',
  ];
  selectedSortBy: string = this.sortByOptions[0];
  dropdowns: { [key: string]: boolean } = {
    sortfilters: false,
  };
  expandedGroups: { [key: string]: boolean } = {};

  openTables: { [key: string]: boolean } = {}; // объект для открытия/закрытия таблиц
  openLists: { [key: string]: boolean } = {};
  userCases: any[] = [];
  stages: Stage[] = [
    { stageName: 'Перша інстанція', decisions: [], files: [] },
    { stageName: 'Апеляційна інстанція', decisions: [], files: [] },
    { stageName: 'Касаційна інстанція', decisions: [], files: [] },
  ];
  userFiles: UploadedFile[] = [];
  currencySymbols: { [key: number]: string } = {
    1: '₴',
    2: '$',
    3: '€',
    4: '₽',
  };
  selectedSubscriptionIds: any;

  @Input() caseNumberId: string;

  @Input() case: any;
  toggleTable(stageName: string) {
    this.openTables[stageName] = !this.openTables[stageName];
  }
  ngOnInit(): void {
    this.loadUserCases();
    console.log('User Cases:', this.userCases);
    console.log('Stages as Array:', this.getStagesAsArray());
  }
  getStageName(stageNumber: number): string {
    const stageNames: { [key: number]: string } = {
      1: 'Касаційна інстанція',
      2: 'Апеляційна інстанція',
      3: 'Перша інстанція',
    };
    return stageNames[stageNumber] || 'Невідомо';
  }
  getStageKeys(): number[] {
    return Object.keys(this.fullCourtData.stages)
      .map((key) => +key) // Преобразование ключей в числа
      .sort((a, b) => b - a); // Сортировка по убыванию
  }

  loadUserCases(): void {
    this.courtDataService.getUsersCases().subscribe(
      (cases) => {
        this.userCases = cases;

        // Извлекаем IDs подписок
        this.selectedSubscriptionIds = this.userCases.map(
          (userCase) => userCase.id
        );

        // Получаем файлы из данных
        this.userFiles = this.userCases.flatMap(
          (userCase) => userCase.files || []
        );

        // Процесс объединения файлов со stages
        this.combineFilesWithStages();
      },
      (error) => {
        console.error('Error loading user cases', error);
      }
    );
  }
  combineFilesWithStages(): void {
    if (this.fullCourtData && this.fullCourtData.stages) {
      // Проверка совпадения caseNumberId
      const matchingCase = this.userCases.find(
        (userCase) => userCase.caseNumberId === this.fullCourtData.id
      );
      if (!matchingCase) {
        console.error(
          'Matching case not found for caseNumberId:',
          this.fullCourtData.id
        );
        return;
      }

      // Инициализируем пустой массив для файлов по инстанциям
      const filesByInstance: { [key: number]: UploadedFile[] } = {};

      // Группируем файлы по instanceId
      matchingCase.files.forEach((file: UploadedFile) => {
        if (file.instanceId !== null) {
          if (!filesByInstance[file.instanceId]) {
            filesByInstance[file.instanceId] = [];
          }
          filesByInstance[file.instanceId].push(file);
        }
      });

      // Добавляем файлы к соответствующим стадиям
      Object.keys(this.fullCourtData.stages).forEach((key) => {
        const stageNumber = +key;
        this.fullCourtData.stages[stageNumber].files =
          filesByInstance[stageNumber] || [];
      });

      this.cdr.markForCheck();
    }
  }

  getJudgmentTypeName(judgmentFormId: number): string {
    switch (judgmentFormId) {
      case 1:
        return 'Вирок';
      case 2:
        return 'Постанова';
      case 3:
        return 'Рішення';
      case 4:
        return 'Судовий наказ';
      case 5:
        return 'Ухвала';
      case 6:
        return 'Окрема ухвала';
      case 7:
        return 'Додаткове рішення';
      case 10:
        return 'Окрема думка';
      default:
        return 'Неизвестный тип документа';
    }
  }

  isTableOpen(stageName: string): boolean {
    return !!this.openTables[stageName];
  }

  toggleList(stageName: string) {
    this.openLists[stageName] = !this.openLists[stageName];
  }

  isListOpen(stageName: string): boolean {
    return !!this.openLists[stageName];
  }

  switchTableView(value: boolean): void {
    this.tableView = value;
  }
  toggleGroup(stageName: string): void {
    this.expandedGroups[stageName] = !this.expandedGroups[stageName];
  }

  isGroupOpen(stageName: string): boolean {
    return this.expandedGroups[stageName];
  }
  sortData(): void {
    console.log('Выбрано поле для сортировки:', this.selectedSortBy);
    console.log(
      'Направление сортировки:',
      this.ascendingSort ? 'Вверх' : 'Вниз'
    );

    // Проход по каждой стадии дела и сортировка решений внутри каждой стадии
    this.getStagesAsArray().forEach((stage) => {
      if (this.selectedSortBy === 'Датою отримання') {
        stage.decisions.sort((a, b) => {
          const dateA = new Date(a.receipt_date);
          const dateB = new Date(b.receipt_date);
          return this.ascendingSort
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
      } else if (this.selectedSortBy === 'Датою Публікації') {
        stage.decisions.sort((a, b) => {
          const dateA = new Date(a.date_publ);
          const dateB = new Date(b.date_publ);
          return this.ascendingSort
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
      } else if (this.selectedSortBy === 'Датою винесення рішення') {
        stage.decisions.sort((a, b) => {
          const dateA = new Date(a.adjudication_date);
          const dateB = new Date(b.adjudication_date);
          return this.ascendingSort
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
      }
    });

    console.log('Отсортированные данные:', this.getStagesAsArray());
  }

  toggleSortDirection(): void {
    this.ascendingSort = !this.ascendingSort;
    console.log(
      'Направление сортировки изменено на:',
      this.ascendingSort ? 'Вверх' : 'Вниз'
    );
    this.sortData();
  }
  toggleDropdown(filterKey: string): void {
    Object.keys(this.dropdowns).forEach((key) => {
      if (key !== filterKey) {
        this.dropdowns[key] = false;
      }
    });
    this.dropdowns[filterKey] = !this.dropdowns[filterKey];
  }

  selectStage(stage: string) {
    this.selectedStage = stage;
  }

  switchToMainTab() {
    this.activeTab = 'main';
  }

  setSearchString(event: string) {
    this.searchString.emit(event);
    this.searchService.setPlaintiffName(event);
    this.activeModal.dismiss();
  }

  switchToInstancesTab() {
    this.activeTab = 'instances';
  }

  getStagesAsArray(): StageData[] {
    return Object.values(this.fullCourtData.stages).filter(
      (stage) => stage !== undefined
    ) as StageData[];
  }
  onDocumentClick(documentType: string, docTextId: string): void {
    this.documentViewerService.openDocumentInNewTab(documentType, docTextId);
  }
  openDocumentInNewTab(documentType: string, documentText: string) {
    const generateRandomId = () => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 9; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    };

    const uniqueId = generateRandomId();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <title>${documentType}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
          }
          .content-wrapper {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          p {
            margin: 5px 0;
          }
          /* Другие стили */
        </style>
      </head>
      <body>
        <div class="content-wrapper">${documentText}</div>
        <script>
          window.location.hash = '${uniqueId}';
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.document.close();
    }
  }
  switchToHistoryTab() {
    this.activeTab = 'history';
  }
  togglePopover(): void {
    const caseNumberId = this.fullCourtData.id;
    const caseNumber = this.fullCourtData.caseNumber;
    this.checkIfUserSubscribed(caseNumberId).subscribe((isSubscribed) => {
      if (isSubscribed) {
        this.popoverTitle = 'Помилка';
        this.popoverMessage = `Ви вже підписані на оновлення по справі №${caseNumber}.`;
        this.showButtons = false;
        this.popover.toggle();
      } else {
        const title = `Вітаємо, ви успішно підписались на оновлення по справі №${caseNumber}.`;
        const message = `
          Повідомлення про події по справі будуть доступні в особистому кабінеті.
          Бажаєте додати коротке позначення для судової справи?
        `;
        this.popoverTitle = title;
        this.popoverMessage = message;
        this.showButtons = true;
        this.popover.toggle();
      }
    });
  }
  checkIfUserSubscribed(caseNumberId: number): Observable<boolean> {
    return this.courtDataService.getUsersCases().pipe(
      tap((subscriptions: any[]) => console.log(subscriptions)),
      map((subscriptions: any[]) =>
        subscriptions.some((sub) => sub.caseNumberId === caseNumberId)
      )
    );
  }
  handlePopoverConfirmed(event: { tag?: string }): void {
    this.popover.hide();
    this.executeSubscription(this.fullCourtData.caseNumber, event.tag);
  }
  executeSubscription(caseNumberId: string, tag?: string) {
    caseNumberId = this.fullCourtData.id.toString();

    const observable = tag
      ? this.courtDataService.subscribeToCase(caseNumberId, tag)
      : this.courtDataService.subscribeToCase(caseNumberId, '');

    observable.subscribe(
      (response) => {
        console.log('Підписка оформлена', response);
        this.messageService.sendInfo('Ви успішно почали стежити за справою');
      },
      (error) => {
        console.error('Помилка при підписці', error);
        alert('Сталася помилка при спробі підписатися на справу');
      }
    );
  }
  getFilesByInstance(stageName: string): UserCase[] {
    return this.userCases
      .filter((subscription) => subscription.files.length > 0)
      .flatMap((subscription) =>
        subscription.files.filter(
          (file: { instanceId: string }) => file.instanceId === stageName
        )
      );
  }
}
