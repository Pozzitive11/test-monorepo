import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PEAccountInfoModel } from '../../models/pe-account-info.model';
import { PEAccountTransactionModel } from '../../models/pe-account-transaction.model';
import { PEInfoModel } from '../../models/pe-info.model';
import { PeDashboardService } from '../../services/pe-dashboard.service';
import { PeHttpService } from '../../services/pe-http.service';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'pe-private-entrepreneurs-list',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
  templateUrl: './pe-private-entrepreneurs-list.component.html',
  styleUrls: ['./pe-private-entrepreneurs-list.component.css'],
})
export class PePrivateEntrepreneursListComponent {
  @Input() privateEntrepreneursInfo: PEInfoModel[] = [];
  @Input() privateEntrepreneursAccountInfo: PEAccountTransactionModel[] = [];
  @Input() privateEntrepreneursInfoAcc: PEAccountInfoModel[] = [];
  @Input() privateEntrepreneursInfoCollapsed: number[] = [];
  @Input() selectedAccount: number | null = null;
  @Input() privateEntrepreneursInfoActive?: PEInfoModel;

  @Output() hideInfo = new EventEmitter<number>();
  @Output() closeAll = new EventEmitter<void>();
  @Output() openAll = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();
  @Output() selectAccount = new EventEmitter<number>();

  private readonly httpService = inject(PeHttpService);
  private readonly dashboardService = inject(PeDashboardService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly route = inject(Router);

  months: string[] = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ];

  activate(id: number) {
    this.httpService.enablePrivateEntrepreneur(id).subscribe({
      next: (data) => this.messageService.sendInfo(data.description),
      error: (err) =>
        this.messageService.sendError(`${err.status}: ${err.error.detail}`),
      complete: async () => this.dashboardService.isActive(id),
    });
  }

  deactivate(id: number) {
    this.httpService.disablePrivateEntrepreneur(id).subscribe({
      next: (data) => this.messageService.sendInfo(data.description),
      error: (err) =>
        this.messageService.sendError(`${err.status}: ${err.error.detail}`),
      complete: async () => this.dashboardService.isActive(id),
    });
  }

  async fullTableInThisMonth(id: number, month: number, year: number) {
    month = month + 1;
    const start = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${month.toString().padStart(2, '0')}-${lastDay
      .toString()
      .padStart(2, '0')}`;

    await this.route.navigate(['/private_entrepreneurs/table'], {
      queryParams: { start_date: start, end_date: end, accounts_filter: id },
    });
  }

  openAccount(info: number) {
    if (info) {
      this.infoAboutAcc(info).subscribe((infos) => {
        this.privateEntrepreneursAccountInfo = infos;
      });
    }
  }

  infoAboutAcc(id: number) {
    return this.httpService.getPrivateEntrepreneurAccountTransactions(id);
  }

  getDistinctPaymentTypes(info: number): string[] {
    const filteredEntries = this.privateEntrepreneursAccountInfo.filter(
      (entry) => {
        return entry.BankAccountId === info;
      }
    );

    const paymentTypesSet = new Set(
      filteredEntries.map((entry) => entry.PaymentType)
    );

    return Array.from(paymentTypesSet);
  }

  getDistinctPaymentTypesWithMonthYear(
    info: number
  ): { month: number; year: number; paymentTypes: string[] }[] {
    const filteredEntries = this.privateEntrepreneursAccountInfo.filter(
      (entry) => {
        return entry.BankAccountId === info;
      }
    );

    const paymentTypeMap = new Map(); // Используем Map для хранения платежных типов по месяцам и годам

    filteredEntries.forEach((entry) => {
      const entryDate = new Date(entry.EntryDate);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth();

      const key = `${entryYear}-${entryMonth}`; // Создаем ключ в формате "год-месяц"

      if (!paymentTypeMap.has(key)) {
        paymentTypeMap.set(key, []);
      }

      paymentTypeMap.get(key).push(entry.PaymentType);
    });

    // Преобразуем Map в массив объектов с информацией о месяце, годе и платежных типах
    return Array.from(paymentTypeMap.keys()).map((key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      const paymentTypes = paymentTypeMap.get(key);
      return { year, month, paymentTypes };
    });
  }

  getTransactionSumForMonth(
    info: number,
    year: number,
    month: number,
    paymentType: string
  ): number {
    const filteredEntries = this.privateEntrepreneursAccountInfo.filter(
      (entry) => {
        const entryDate = new Date(entry.EntryDate);
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth();

        return (
          entry.BankAccountId === info &&
          entryYear === year &&
          entryMonth === month &&
          entry.PaymentType === paymentType
        );
      }
    );

    return filteredEntries.reduce(
      (total, entry) => total + entry.TransactionSum,
      0
    );
  }
}
