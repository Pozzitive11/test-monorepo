import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PlaintiffService } from '../../../services/plaintiff.service';
import { MiniCourtCard } from '../../../models/court-cards.model';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import {
  CourtDataService,
  UserCasesType,
} from '../../../services/court-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { TagInputDialogComponent } from '../../../tag-input-dialog/tag-input-dialog.component';
import { PopoverDirective, PopoverModule } from 'ngx-bootstrap/popover';
import { ConfirmationPopoverComponent } from '../../../confirmation-popover/confirmation-popover.component';
import { map, Observable, tap } from 'rxjs';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-mini-court-card',
  templateUrl: './court-mini-cards.component.html',
  styleUrls: ['./court-mini-cards.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PopoverModule,
    ConfirmationPopoverComponent,
    CommonModule,
  ],
})
export class MiniCourtCardComponent implements OnInit {
  userCases: any;
  noCasesFound: boolean;
  constructor(
    private courtDataService: CourtDataService,
    private messageService: MessageHandlingService,
    public dialog: MatDialog
  ) {}
  readonly searchService = inject(PlaintiffService);
  @ViewChild('popover', { static: false }) popover: PopoverDirective;
  popoverMessage: string;
  @Input() miniCourtData: MiniCourtCard;
  @Output() openModal = new EventEmitter<any>();
  @Output() searchString = new EventEmitter<string>();
  @Output() subscribeDeal = new EventEmitter<MiniCourtCard>();
  @Input() caseNumberIds: number[];
  @Input() id: number;
  plaintiffName: string = '';
  defendantName: string = '';
  popoverTitle: string = '';
  showButtons: boolean;
  isSubscribed = false;
  setSearchString(event: string) {
    this.searchString.emit(event);
    this.searchService.setPlaintiffName(event);
  }
  subscribeToDeal(deal: MiniCourtCard) {
    this.subscribeDeal.emit(deal);
  }

  miniCourtDataList: any[] = []; // Массив для хранения данных из карточек
  tableData: any[] = []; // Массив для отображения данных в таблице
  currentView = 'cards';

  switchView(view: string) {
    this.currentView = view;
    if (this.currentView === 'list') {
      this.convertToTable(); // При переключении на режим таблицы конвертируем данные в таблицу
    }
  }
  ngOnInit(): void {
    if (this.caseNumberIds && this.caseNumberIds.length > 0) {
      this.isSubscribed = this.caseNumberIds.includes(this.miniCourtData.id);
    }
  }
  toggleSubscription(): void {
    if (this.isSubscribed) {
      this.unsubscribeFromSubscription();
    } else {
      this.togglePopover();
    }
  }

  convertToTable() {
    this.tableData = []; // Очищаем массив перед добавлением данных
    // Проходим по miniCourtDataList и добавляем данные в tableData
    this.miniCourtDataList.forEach((miniCourtData) => {
      this.tableData.push({
        caseNumber: miniCourtData.caseNumber,
        courtName: miniCourtData.courtName,
        judge: miniCourtData.judge,
        // Добавьте другие поля из miniCourtData, которые необходимы для отображения в таблице
      });
    });
  }

  executeSubscription(caseNumberId: string, tag?: string) {
    caseNumberId = this.miniCourtData.id.toString();

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

  togglePopover(): void {
    const caseNumberId = this.miniCourtData.id;
    const caseNumber = this.miniCourtData.caseNumber;
    this.checkIfUserSubscribed(caseNumberId).subscribe((isSubscribed) => {
      if (isSubscribed) {
        this.isSubscribed = true;
        // Здесь убираем код показа поповера для случая, когда уже подписан
      } else {
        this.isSubscribed = false;
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

  unsubscribeFromSubscription(): void {
    if (this.id) {
      this.courtDataService.unsubscribeFromCase(this.id).subscribe(
        () => {
          console.log(
            `Отписка успешно выполнена для subscriptionId: ${this.id}`
          );
          this.isSubscribed = false;
          this.messageService.sendInfo('Ви успішно відписались від справи');
          // Дополнительные действия после успешной отписки
        },
        (error) => {
          console.error('Ошибка при отписке:', error);
          // Обработка ошибок при отписке
        }
      );
    } else {
      console.error('subscriptionId не определен или равен undefined.');
    }
  }

  handlePopoverConfirmed(event: { tag?: string }): void {
    this.popover.hide();
    this.executeSubscription(this.miniCourtData.caseNumber, event.tag);
    this.isSubscribed = true;
  }
}
