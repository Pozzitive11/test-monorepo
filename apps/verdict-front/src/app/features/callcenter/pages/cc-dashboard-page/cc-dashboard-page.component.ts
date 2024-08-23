import { Component, inject } from '@angular/core';
import { CcDashboardPageService } from '../../services/cc-dashboard-page-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { NgbDate, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CcFiltersService } from '../../services/cc-filters.service';
import { saveAs } from 'file-saver';
import { DatePickerRangePopupComponent } from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component';
import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { ProjectComponent } from '../../components/filters/project/project.component';
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'app-cc-dashboard-page',
  templateUrl: './cc-dashboard-page.component.html',
  styleUrls: ['./cc-dashboard-page.component.css'],
  providers: [CcDashboardPageService],
  standalone: true,
  imports: [
    NgxSpinnerModule,
    ProjectManagerComponent,
    ProjectComponent,
    NgbTooltip,
    NgIf,
    DatePickerRangePopupComponent,
    NgFor,
    PercentPipe,
  ],
})
export class CcDashboardPageComponent {
  private ccDashboardService = inject(CcDashboardPageService);
  private spinner = inject(NgxSpinnerService);
  private ccFilters = inject(CcFiltersService);

  dataLoaded = false;
  data: any[] = [];
  columns: string[] = [];
  rowToPercents = [
    'РТР/РПС',
    'Кепт сума',
    'Кепт кількість',
    'Комісія на поточний місяць',
    'Керт кількість за попередній місяць',
  ];
  date = {
    actual: true,
    datepicker: false,
  };
  ccDashboardDatesRange: { MinDate: NgbDate | null; MaxDate: NgbDate | null } =
    { MinDate: null, MaxDate: null };
  ccDashboardDateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null } =
    { fromDate: null, toDate: null };
  private dataIsLoaded$: Subscription | undefined;

  // ngOnInit() {
  //   // this.dataIsLoaded$ = this.ccDashboardService.dataIsLoaded$?.subscribe((isLoaded: boolean) => {
  //   //   this.dataLoaded = isLoaded
  //   //   if (isLoaded) {
  //   //     this.spinner.hide()
  //   //   }
  //   // })
  // }

  ngOnDestroy() {
    this.dataIsLoaded$?.unsubscribe();
  }

  updateFilter(filter: string) {
    this.date.actual = false;
    this.date.datepicker = false;

    if (filter === 'actual') {
      this.date.actual = true;
    } else if (filter === 'datepicker') {
      this.date.datepicker = true;
    }
  }

  loadData() {
    let startDate;
    let finishDate;

    if (this.date.actual) {
      const firstDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      startDate = UtilFunctions.formatDate(firstDayOfMonth, false, '%Y-%m-%d');

      const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      finishDate = UtilFunctions.formatDate(yesterday, false, '%Y-%m-%d');
    } else {
      startDate = UtilFunctions.formatNgbDate(
        this.ccDashboardDateFilter.fromDate,
        '%Y-%m-%d'
      );
      finishDate = UtilFunctions.formatNgbDate(
        this.ccDashboardDateFilter.toDate,
        '%Y-%m-%d'
      );
    }

    const input_data = {
      StartDate: startDate,
      FinishDate: finishDate,
      Projects: this.ccFilters.selectedProjects,
    };

    this.spinner.show();
    this.ccDashboardService.postData(input_data, this.date.actual).subscribe(
      (responseData: any[]) => {
        this.updateData(responseData);
        this.dataLoaded = true;
        this.spinner.hide();
      },
      (error) => {
        console.error('Ошибка загрузки данных:', error);
        this.spinner.hide();
      }
    );
  }

  downloadExcel() {
    this.ccDashboardService.downloadExcel(this.data).subscribe((file) => {
      saveAs(file, 'Метрики');
    });
  }

  isAllFilterSelected() {
    return !!(
      this.ccFilters.selectedProjects &&
      this.ccDashboardDateFilter.fromDate &&
      this.ccDashboardDateFilter.toDate
    );
  }

  updateData(data: any[]): void {
    this.data = data;
    this.columns = data.length > 0 ? Object.keys(data[0]) : [];
  }
}
