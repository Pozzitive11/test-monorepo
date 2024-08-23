import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { QualityHttpService } from '../../services/quality-http.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { catchError, of } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Contragent,
  Operator,
  Recruiter,
  Supervisor,
} from '../../models/monitoring.models';
import { QualityManagementService } from '../../services/quality-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePickerRangePopupComponent } from 'apps/verdict-front/src/app/shared/components/date-picker-range-popup/date-picker-range-popup.component';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'app-quality-monitoring-management',
  standalone: true,
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    DatePickerRangePopupComponent,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  templateUrl: './quality-monitoring-management.component.html',
  styleUrls: ['./quality-monitoring-management.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class QualityMonitoringManagementComponent implements OnInit {
  public readonly qualityHttpService = inject(QualityHttpService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageHandlingService);
  protected qualityManagementService = inject(QualityManagementService);
  private readonly destroyRef = inject(DestroyRef);

  // range = new FormGroup({
  //   start: new FormControl<Date | null>(null),
  //   end: new FormControl<Date | null>(null)
  // })
  dates: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };
  tableHeaders: string[] = [];
  monitoringTableData: { [key: string]: any }[] = [];

  showMonitoringsForm: FormGroup;

  loader = false;

  get listTypeControl(): FormControl {
    return this.showMonitoringsForm.get('listType') as FormControl;
  }

  get supervisorsListControl(): FormControl {
    return this.showMonitoringsForm.get('supervisorsList') as FormControl;
  }

  get conductedMonitoringListControl(): FormControl {
    return this.showMonitoringsForm.get(
      'conductedMonitoringList'
    ) as FormControl;
  }

  get recruiterListControl(): FormControl {
    return this.showMonitoringsForm.get('recruiterList') as FormControl;
  }

  get contragentListControl(): FormControl {
    return this.showMonitoringsForm.get('contragentList') as FormControl;
  }

  get operatorsListControl(): FormControl {
    return this.showMonitoringsForm.get('operatorsList') as FormControl;
  }

  // get dateControl(): FormControl {
  //   return this.showMonitoringsForm.get('date') as FormControl
  // }

  ngOnInit(): void {
    this.createShowMonitoringsForm();

    this.qualityManagementService.getSelectsList();
    // this.setMonitoringSearchParams()

    // if (this.getStoredData('selectsAndDateParams')) {
    //   this.showMonitoring()
    // }

    this.listTypeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.monitoringTableData = [];
        this.tableHeaders = [];
        this.operatorsListControl.setValue([]);
        this.recruiterListControl.setValue([]);
        this.contragentListControl.setValue([]);
      });
  }

  createShowMonitoringsForm() {
    this.showMonitoringsForm = this.formBuilder.group({
      listType: [{ id: 1, name: 'Лист оцінки операторів' }],
      supervisorsList: [[]],
      conductedMonitoringList: [[]],
      recruiterList: [[]],
      contragentList: [[]],
      operatorsList: [[]],
    });
  }

  showMonitoring() {
    this.loader = true;

    const startDate = this.dates.fromDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.fromDate)
      : null;
    const endDate = this.dates.toDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.toDate)
      : null;

    const contragentIdList = this.contragentListControl.value.map(
      (value: Contragent) => value.id
    );
    const specialistSkkIdList = this.conductedMonitoringListControl.value.map(
      (value: Supervisor) => value.Id
    );
    const supervisorIdList = this.supervisorsListControl.value.map(
      (value: Supervisor) => value.Id
    );
    const recruiterIdList = this.recruiterListControl.value.map(
      (value: Recruiter) => value.Id
    );
    const operatorIdList = this.operatorsListControl.value.map(
      (value: Operator) => value.Id
    );

    const monitoringSearchParams = {
      list_type_id: this.listTypeControl.value.id,
      start_date: startDate,
      end_date: endDate,
      contragent_list_id: contragentIdList,
      supervisor_list_id: supervisorIdList,
      specialists_skk_list_id: specialistSkkIdList,
      oper_recr_list_id:
        operatorIdList.length !== 0 ? operatorIdList : recruiterIdList,
    };

    this.qualityHttpService
      .startMonitoring(monitoringSearchParams)
      .pipe(
        catchError(() => {
          this.messageService.sendError('Невірний формат даних');
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.monitoringTableData = data;
        if (data.length === 0) {
          this.loader = false;
        }
        if (data.length > 0) {
          this.loader = false;
          this.tableHeaders = UtilFunctions.getObjectKeys(data);
        }
      });
    // this.storeSelectsAndDateParams()
  }

  // storeSelectsAndDateParams() {
  //   const selectsAndDateParams = {
  //     listType: this.listTypeControl.value,
  //     // startDate: this.range.value ? this.range.value.start : null,
  //     // endDate: this.range.value ? this.range.value.end : null,
  //     startDate: this.dates.fromDate ? this.dates.fromDate : null,
  //     endDate: this.dates.toDate ? this.dates.toDate : null,
  //     contragent: this.contragentListControl.value,
  //     specialistSkk: this.conductedMonitoringListControl.value,
  //     supervisor: this.supervisorsListControl.value,
  //     recruiter: this.recruiterListControl.value,
  //     operator: this.operatorsListControl.value
  //   }
  //   localStorage.setItem('selectsAndDateParams', JSON.stringify(selectsAndDateParams))
  // }

  // getStoredData(storedObjectType: string) {
  //   const storedObject = localStorage.getItem(storedObjectType)
  //   if (storedObject !== null) {
  //     return JSON.parse(storedObject)
  //   }
  // }

  // setMonitoringSearchParams() {
  //   if (this.getStoredData('selectsAndDateParams')) {
  //     const storedParams = this.getStoredData('selectsAndDateParams')
  //     this.listTypeControl.setValue(storedParams.listType)

  //     // this.range.setValue({
  //     //   start: new Date(storedParams.startDate),
  //     //   end: new Date(storedParams.endDate)
  //     // })
  //     this.dates = {
  //       fromDate: storedParams.startDate,
  //       toDate: storedParams.endDate
  //     }
  //     this.supervisorsListControl.setValue(storedParams.supervisor)
  //     this.conductedMonitoringListControl.setValue(storedParams.specialistSkk)
  //     this.recruiterListControl.setValue(storedParams.recruiter)
  //     this.contragentListControl.setValue(storedParams.contragent)
  //     this.operatorsListControl.setValue(storedParams.operator)
  //   }
  // }

  openEditModal(row: { [p: string]: any }) {
    if (row['Редагувати'] !== 'Ви не проводили цей моніторинг') {
      const queryParams: NavigationExtras = {
        queryParams: {
          monitID: row['Id'],
          user: row['ПІБ рекрутера'],
          useroper: row['ПІБ оператора'],
        },
      };
      this.router.navigate(['/quality-control/edit-monitoring'], queryParams);
    }
  }
}
