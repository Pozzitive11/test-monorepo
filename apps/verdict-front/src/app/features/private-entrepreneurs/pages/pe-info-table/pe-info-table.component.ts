import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DatePickerRangePopupComponent } from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component';
import { MessageHandlingService } from '../../../../shared/services/message-handling.service';
import { PeHttpService } from '../../services/pe-http.service';
import { PeTableEditModalComponent } from '../../ui/pe-table-edit-modal/pe-table-edit-modal.component';
import { TableWithFiltersComponent } from '../../../../shared/components/table-with-filters/table-with-filters.component';
import { TTable } from '../../../../shared/models/basic-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

interface IMultiSelectOption {
  number: number;
  name: string | null;
}

interface IMultiSelectOptionInIban {
  peInfo: number;
  idIs: number;
  IBAN: string | null;
}

@Component({
  selector: 'app-pe-info-table',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    DatePickerRangePopupComponent,
    TableWithFiltersComponent,
  ],
  templateUrl: './pe-info-table.component.html',
  styleUrls: ['./pe-info-table.component.css'],
})
export class PeInfoTableComponent implements OnInit {
  private readonly httpService = inject(PeHttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly modalService = inject(NgbModal);
  private readonly messageService = inject(MessageHandlingService);
  private readonly destroyRef = inject(DestroyRef);

  tableData = signal<TTable>([]);
  loading = signal<boolean>(false);

  accounts_filter: number[] = [];
  dec_date?: { start: string | null; end: string | null };
  dropdownListPrivateEntrepreneurs: IMultiSelectOption[] = [];
  selectedItems: IMultiSelectOption[] = [];

  select: number[] = [];
  dropdownAccountsList: IMultiSelectOptionInIban[] = [];
  drop: IMultiSelectOptionInIban[] = [];
  selectedItems2: IMultiSelectOptionInIban[] = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'number',
    textField: 'name',
    itemsShowLimit: 0,
    allowSearchFilter: true,
  };
  dropdownSettings2 = {
    singleSelection: false,
    idField: 'idIs',
    textField: 'IBAN',
    itemsShowLimit: 0,
    allowSearchFilter: true,
  };

  datesRange: { MinDate: NgbDate | null; MaxDate: NgbDate | null } = {
    MinDate: null,
    MaxDate: null,
  };

  dates1: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };

  private parseDate(dateStr: string): NgbDate {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new NgbDate(year, month, day);
  }

  onSelect(item: any) {
    //  console.log(item, this.selectedItems, this.selectedItems.includes(item.number))
    if (!this.selectedItems.includes(item.number)) {
      this.select.push(item.number);
    }

    this.dropdownAccountsList = [];

    this.httpService.getPrivateEntrepreneursById(item.number).subscribe({
      next: (info) => {
        for (let z of info.Accounts) {
          this.drop.push({
            peInfo: item.number,
            idIs: z.BankAccountId,
            IBAN: z.IBAN,
          });
        }
      },
      complete: () => {
        this.dropdownAccountsList = this.drop;
        this.cd.detectChanges();
      },
    });
  }

  onDeSelect(item: any) {
    this.select = this.select.filter((number) => number !== item.number);

    this.drop = this.drop.filter((z) => z.peInfo !== item.number);

    this.accounts_filter = this.accounts_filter.filter((id) => {
      return this.drop.some((dropItem) => dropItem.idIs === id);
    });

    this.selectedItems2 = this.selectedItems2.filter((selectedItem) => {
      return this.drop.some((dropItem) => dropItem.idIs === selectedItem.idIs);
    });

    this.dropdownAccountsList = this.drop;

    this.cd.detectChanges();
  }

  onDeSelectAll() {
    this.dropdownAccountsList = [];
    this.select = [];
    this.accounts_filter = [];
  }

  onSelectAll() {
    this.select = this.dropdownListPrivateEntrepreneurs.map(
      (item) => item.number
    );
    this.dropdownAccountsList = [];

    this.httpService.getPrivateEntrepreneurs().subscribe({
      next: (info) => {
        for (let i = 0; i < info.length; i++) {
          for (let j = 0; j < info[i].Accounts.length; j++) {
            this.drop.push({
              peInfo: info[i].id,
              idIs: info[i].Accounts[j].BankAccountId,
              IBAN: info[i].Accounts[j].IBAN,
            });
          }
        }
      },
      complete: () => {
        this.dropdownAccountsList = this.drop;
        this.cd.detectChanges(); // Уведомляем Angular об изменениях
      },
    });
  }

  onSelectIBAN(item: any) {
    if (!this.dropdownAccountsList.includes(item.idIs)) {
      this.accounts_filter.push(item.idIs);
    }
  }

  onDeSelectIBAN(item: any) {
    const index = this.accounts_filter.indexOf(item.idIs);
    if (index !== -1) {
      this.accounts_filter.splice(index, 1);
    }
  }

  onDeSelectAllIBAN() {
    this.accounts_filter = [];
  }

  onSelectAllIBAN() {
    this.httpService.getPrivateEntrepreneurs().subscribe({
      next: (info) => {
        for (let i = 0; i < info.length; i++) {
          for (let j = 0; j < info[i].Accounts.length; j++) {
            this.accounts_filter.push(info[i].Accounts[j].BankAccountId);
          }
        }
      },
      complete: () => {},
    });
  }

  ngOnInit(): void {
    this.httpService.getTransactionsPeriod().subscribe({
      next: (data) => {
        this.datesRange.MinDate = this.parseDate(data.MinDate);
        this.datesRange.MaxDate = this.parseDate(data.MaxDate);
      },
    });

    this.httpService.getPrivateEntrepreneurs().subscribe((info) => {
      this.dropdownListPrivateEntrepreneurs = info.map((item) => ({
        number: item.id,
        name: item.Name,
      }));
    });

    const start_date = this.route.snapshot.queryParams['start_date'];
    const end_date = this.route.snapshot.queryParams['end_date'];
    const accounts_filter = [
      this.route.snapshot.queryParams['accounts_filter'],
    ];

    if (start_date) {
      this.loading.set(true);
      this.httpService
        .getPaymentsHistoryByAccounts(start_date, end_date, accounts_filter)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (data) => this.tableData.set(data),
          error: (error) => this.messageService.alertError(error),
        });
    }
  }

  update() {
    if (this.dec_date) {
      if (this.dec_date.end != null && this.dec_date.start != null) {
        this.loading.set(true);
        this.httpService
          .getPaymentsHistoryByAccounts(
            this.dec_date.start,
            this.dec_date.end,
            this.accounts_filter
          )
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.loading.set(false))
          )
          .subscribe({
            next: (data) => this.tableData.set(data),
            error: (error) => this.messageService.alertError(error),
          });
      }
    }
  }

  updateData() {
    const dateFilter1 = {
      start: this.dates1.fromDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates1.fromDate)
        : null,
      end: this.dates1.toDate
        ? UtilFunctions.ngbDateStructToStringDate(this.dates1.toDate)
        : null,
    };
    if (dateFilter1.end === null) {
      dateFilter1.end = '';
    }
    if (dateFilter1.start === null) {
      dateFilter1.start = '';
    }
    this.dec_date = dateFilter1;

    if (this.dec_date.end && this.dec_date.start) {
      this.update();
    }
  }

  async openEditModal(row: { [p: string]: any }) {
    const modalRef = this.modalService.open(PeTableEditModalComponent, {
      size: 'lg',
    });
    const componentInstance: PeTableEditModalComponent =
      modalRef.componentInstance;
    componentInstance.row = { ...row };
    componentInstance.loading = true;
    this.httpService.getPaymentTypes().subscribe({
      next: (paymentTypes) => (componentInstance.paymentTypes = paymentTypes),
      error: async (error) => {
        await this.messageService.alertError(error);
        modalRef.close();
      },
      complete: () => (componentInstance.loading = false),
    });

    try {
      const lastValue = row['Тип платежу'];
      const result = await modalRef.result;
      this.tableData.update((tableData) =>
        tableData.map((value) =>
          value['id'] === result['id'] ? result : value
        )
      );

      this.httpService
        .savePaymentType(result['id'], result['Тип платежу'])
        .subscribe({
          next: (info) => this.messageService.sendInfo(info.description),
          error: async (error) => {
            await this.messageService.alertError(error);
            this.tableData.update((tableData) => {
              return tableData.map((value) =>
                value['id'] === result['id']
                  ? { ...value, 'Тип платежу': lastValue }
                  : value
              );
            });
          },
        });
    } catch (_) {}
  }
}
