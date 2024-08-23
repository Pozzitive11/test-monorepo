import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DcSendingDocsFiltersService } from '../../services/dc-sending-docs-filters.service';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { dcSendingWays } from '../../models/dc-sending-ways.type';
import { DcTemplatesService } from '../../services/dc-templates.service';
import { DcUploadDocsCellComponent } from '../dc-promotion-cells/dc-docs-cell/dc-upload-docs-cell.component';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'dc-sending-docs-table',
  templateUrl: './dc-sending-docs-table.component.html',
  styleUrls: ['./dc-sending-docs-table.component.css'],
  standalone: true,
  imports: [
    NgIf,
    DcUploadDocsCellComponent,
    NgFor,
    NgClass,
    CurrencyPipe,
    FormsModule,
  ],
})
export class DcSendingDocsTableComponent implements OnInit {
  protected sendingDocsPaginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly sendingDocsFiltersService = inject(DcSendingDocsFiltersService);
  readonly templateService = inject(DcTemplatesService);

  applications: { [key: string]: any }[] = [];
  selectedRows: number[] = [];
  isTableVisible: boolean = true;
  tableHeaders: string[] = [];

  booleanTableHeaders = [
    'Інформаційний лист',
    'Договір факторингу',
    'Витяг',
    'Угода про списання частини боргу',
    'Гарантійний лист',
    'Додаток про нарахуванн',
    'Оригінал КД',
  ];

  temporaryPageSize: number;

  ngOnInit() {
    this.sendingDocsFiltersService.initializeData();
    this.sendingDocsPaginationService
      .calculatePageCredits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.sendingDocsPaginationService.paginatedCredits$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.applications = data;
        this.tableHeaders = UtilFunctions.getObjectKeys(data);
      });
    this.sendingDocsFiltersService.selectedRowIds$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedRows) => {
        this.selectedRows = selectedRows;
      });
    this.sendingDocsPaginationService.pageSize$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((size) => {
        this.temporaryPageSize = size;
      });
  }
  updatePageSize() {
    this.sendingDocsPaginationService.setPageSize(this.temporaryPageSize);
  }
  handleClickOnConfirmationCell(event: Event): void {
    event.stopPropagation();
  }

  applyFilter(key: string, value: string) {
    if (!value) {
      this.sendingDocsFiltersService.textFilters =
        this.sendingDocsFiltersService.textFilters.filter(
          (value) => value.col !== key
        );
      this.sendingDocsFiltersService
        .getFilteredApplications()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      return;
    }
    this.sendingDocsFiltersService.textFilters.push({
      col: key,
      value: value.toLowerCase(),
    });
    this.sendingDocsFiltersService
      .getFilteredApplications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filteredData) => {
        this.isTableVisible = filteredData.length > 0;
      });
  }

  isRowSelected(id: number): boolean {
    return this.selectedRows.includes(id);
  }

  toggleRowSelection(row: { [key: string]: any }): void {
    if (
      row['Дата відправки'] === null
      // this.sendingDocsFiltersService.appliedFilters$.value.includes('downloadDocuments') &&
      // row['Шляхи відправки'] !== 'Електронна пошта'
    ) {
      this.sendingDocsFiltersService.toggleRowSelection(row['id']);
    }
  }

  selectAllRows() {
    const allRowIds = this.applications.map((row) => row['id']);
    const allSelectedRows = allRowIds.every((id) => this.isRowSelected(id));

    if (allSelectedRows) {
      allRowIds.forEach((id) => this.sendingDocsFiltersService.deselectRow(id));
    } else {
      allRowIds.forEach((id) => this.sendingDocsFiltersService.selectRow(id));
    }
  }

  colorClassForRow(wayType: string) {
    if (dcSendingWays.electrPoshta.includes(wayType)) return 'electr-poshta';
    else if (dcSendingWays.ukrPoshta.includes(wayType)) return 'ukr-poshta';
    else if (dcSendingWays.novaPoshta.includes(wayType)) return 'nova-poshta';
    else if (dcSendingWays.electrNovaPoshta.includes(wayType))
      return 'electr-nova-poshta';
    else if (dcSendingWays.electrUkrPoshta.includes(wayType))
      return 'electr-ukr-poshta';
    else if (dcSendingWays.ukrNovaPoshta.includes(wayType))
      return 'ukr-nova-poshta';
    else return 'selected';
  }

  documentFilter(key: string) {
    const index = this.sendingDocsFiltersService.documentFilters.indexOf(key);
    if (index === -1) {
      this.sendingDocsFiltersService.documentFilters.push(key);
    } else {
      this.sendingDocsFiltersService.documentFilters.splice(index, 1);
    }
    this.sendingDocsFiltersService.getFilteredApplications().subscribe();
  }
}
