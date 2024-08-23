import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { QualityHttpService } from '../../services/quality-http.service';
import { finalize } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Contragent,
  Operator,
  Recruiter,
  ReportByGpa,
  ReportByPeriod,
  Supervisor,
} from '../../models/monitoring.models';
import { NgSelectModule } from '@ng-select/ng-select';
import { QualityManagementService } from '../../services/quality-management.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TableWithFiltersComponent } from '../../../../shared/components/table-with-filters/table-with-filters.component';
import { TTable } from '../../../../shared/models/basic-types';
import { DatePickerRangePopupComponent } from 'apps/verdict-front/src/app/shared/components/date-picker-range-popup/date-picker-range-popup.component';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

interface CheckboxDictionary {
  name: string;
  selected: boolean;
  value: string;
  listTypeId?: number[];
}

interface FormBase {
  isSelected: boolean;
  value: string;
  name: string;
  listTypeId?: number[][];
}

interface ReportParams {
  list_type_id: number;
  start_date: string | null;
  end_date: string | null;
  contragent_list_id: number[];
  supervisor_list_id: number[];
  specialists_skk_list_id: number[];
  oper_recr_list_id: number[];

  [key: string]: any;
}

interface CheckboxItem {
  name: string;
  selected: boolean;
  value: string;
  listTypeId?: number[];
}

type CheckboxParams = {
  [key: string]: boolean;
};

@Component({
  selector: 'app-quality-report-management',
  standalone: true,
  imports: [
    CommonModule,
    DatePickerRangePopupComponent,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    TableWithFiltersComponent,
  ],
  templateUrl: './quality-report-management.component.html',
  styleUrls: ['./quality-report-management.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class QualityReportManagementComponent {
  public readonly qualityHttpService = inject(QualityHttpService);
  private readonly formBuilder = inject(FormBuilder);
  protected qualityManagementService = inject(QualityManagementService);
  private readonly destroyRef = inject(DestroyRef);

  tableData = signal<TTable>([]);
  loading = signal<boolean>(false);

  generatedReport: ReportByGpa[] | ReportByPeriod[] = [];
  dates: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: null,
    toDate: null,
  };
  formingReportForm: FormGroup;
  reportTypeList = [
    { id: 1, name: 'Звіт за період' },
    { id: 2, name: 'Середній бал' },
  ];
  reportType = 1;

  // range = new FormGroup({
  //   start: new FormControl<Date | null>(null),
  //   end: new FormControl<Date | null>(null)
  // })
  get reportTypeControl(): FormControl {
    return this.formingReportForm.get('reportType') as FormControl;
  }

  get listTypeControl(): FormControl {
    return this.formingReportForm.get('listType') as FormControl;
  }

  get supervisorsListControl(): FormControl {
    return this.formingReportForm.get('supervisorsList') as FormControl;
  }

  get conductedMonitoringListControl(): FormControl {
    return this.formingReportForm.get('conductedMonitoringList') as FormControl;
  }

  get recruiterListControl(): FormControl {
    return this.formingReportForm.get('recruiterList') as FormControl;
  }

  get contragentListControl(): FormControl {
    return this.formingReportForm.get('contragentList') as FormControl;
  }

  get operatorsListControl(): FormControl {
    return this.formingReportForm.get('operatorsList') as FormControl;
  }

  get listTypePeroidReportCheckboxesArray(): FormArray {
    return this.formingReportForm.get(
      'listTypePeroidReportCheckboxesArray'
    ) as FormArray;
  }

  get peroidReportCheckboxesArray(): FormArray {
    return this.formingReportForm.get(
      'peroidReportCheckboxesArray'
    ) as FormArray;
  }

  get listTypeAverageScoreCheckboxesArray(): FormArray {
    return this.formingReportForm.get(
      'listTypeAverageScoreCheckboxesArray'
    ) as FormArray;
  }

  get averageScoreCheckboxesArray(): FormArray {
    return this.formingReportForm.get(
      'averageScoreCheckboxesArray'
    ) as FormArray;
  }

  // get dateControl(): FormControl {
  //   return this.formingReportForm.get('date') as FormControl
  // }
  areListTypePeroidReportCheckboxesAllSelected = false;

  listTypePeroidReportCheckboxes = [
    { name: 'ПІБ рекрутера', selected: false, listTypeId: [2], value: 'hrPib' },
    {
      name: 'ПІБ оператора',
      selected: false,
      listTypeId: [1],
      value: 'operatorPib',
    },
    {
      name: 'Ознака дисконт/реструктуризація',
      selected: false,
      listTypeId: [1],
      value: 'show_restr_discount',
    },
    {
      name: 'ПІБ супервізора',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_pib_supervisor',
    },
    {
      name: 'ПІБ оцінщика',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_pib_specialists_skk',
    },
    {
      name: 'Результат дзвінку',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_call_result',
    },
    {
      name: 'Тип дзвінка',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_call_type',
    },
    {
      name: 'Виключити вихідні дні',
      selected: false,
      listTypeId: [1, 2],
      value: 'exept_weekend',
    },
    {
      name: 'Сильні сторони',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_strong_side',
    },
    {
      name: 'Слабкі сторони',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_weak_side',
    },
    {
      name: 'Коментар',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_comment',
    },
    {
      name: 'Id дзвінка',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_call_id',
    },
    {
      name: 'Телефон',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_phone',
    },
    {
      name: 'Критичні помилки',
      selected: false,
      listTypeId: [1, 2],
      value: 'show_cr_mistake',
    },
    { name: 'НКС', selected: false, listTypeId: [1], value: 'show_nks' },
    {
      name: 'Контакт з',
      selected: false,
      listTypeId: [1],
      value: 'show_contact_with',
    },
  ];
  listTypeAverageScoreCheckboxes = [
    {
      name: 'ПІБ оператора',
      selected: false,
      listTypeId: [1],
      value: 'operatorPib',
    },
    {
      name: 'Додати групування за контрагентом',
      selected: false,
      listTypeId: [1],
      value: 'add_gr_by_contragent',
    },
    { name: 'ПІБ рекрутера', selected: false, listTypeId: [2], value: 'hrPib' },
  ];
  peroidReportCheckboxes = [
    {
      name: 'Тільки тестові дзвінки',
      selected: false,
      value: 'only_test_call',
    },
    {
      name: 'Не враховуючи тестових дзвінків',
      selected: false,
      value: 'exept_test_call',
    },
    { name: 'Лише загальний бал', selected: false, value: 'only_tot_score' },
    { name: 'Лише загальний штраф', selected: false, value: 'only_tot_fine' },
  ];
  averageScoreCheckboxes = [
    {
      name: 'Тільки тестові дзвінки',
      selected: false,
      value: 'only_test_call',
    },
    {
      name: 'Не враховуючи тестових дзвінків',
      selected: false,
      value: 'exept_test_call',
    },
    { name: 'Лише загальний бал', selected: false, value: 'only_tot_score' },
    { name: 'Лише загальний штраф', selected: false, value: 'only_tot_fine' },
    {
      name: 'Рахувати кількість критичних помилок',
      selected: false,
      value: 'count_mistake',
    },
  ];

  ngOnInit(): void {
    this.createFormingReportForm();
    this.qualityManagementService.getSelectsList();
    this.setupControlListeners();
    this.trackCheckboxChanges();
  }

  private setupControlListeners(): void {
    this.listTypeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resetFormState());
    this.reportTypeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resetFormState());
  }

  private resetFormState(): void {
    this.areListTypePeroidReportCheckboxesAllSelected = false;
    this.resetCheckboxes(this.listTypePeroidReportCheckboxesArray);
    this.resetCheckboxes(this.peroidReportCheckboxesArray);
    this.resetCheckboxes(this.listTypeAverageScoreCheckboxesArray);
    this.resetCheckboxes(this.averageScoreCheckboxesArray);
    this.tableData.set([]);
  }

  private resetCheckboxes(checkboxesArray: FormArray): void {
    checkboxesArray.controls.forEach((checkboxGroup) => {
      checkboxGroup.patchValue({ isSelected: false });
    });
  }

  createFormingReportForm() {
    this.formingReportForm = this.formBuilder.group({
      // date: [null],
      reportType: [{ id: 1, name: 'Звіт за період' }],
      listType: [{ id: 1, name: 'Лист оцінки операторів' }],
      supervisorsList: [[]],
      conductedMonitoringList: [[]],
      recruiterList: [[]],
      contragentList: [[]],
      operatorsList: [[]],
      listTypePeroidReportCheckboxesArray: new FormArray([]),
      peroidReportCheckboxesArray: new FormArray([]),
      listTypeAverageScoreCheckboxesArray: new FormArray([]),
      averageScoreCheckboxesArray: new FormArray([]),
    });
    this.initListTypeCheckboxes(
      this.listTypePeroidReportCheckboxes,
      'listTypePeroidReportCheckboxesArray',
      true
    );
    this.initListTypeCheckboxes(
      this.peroidReportCheckboxes,
      'peroidReportCheckboxesArray',
      false
    ),
      this.initListTypeCheckboxes(
        this.listTypeAverageScoreCheckboxes,
        'listTypeAverageScoreCheckboxesArray',
        true
      ),
      this.initListTypeCheckboxes(
        this.averageScoreCheckboxes,
        'averageScoreCheckboxesArray',
        false
      );
  }

  initListTypeCheckboxes(
    checkboxes: CheckboxDictionary[],
    formArrayName: string,
    includeListTypeId: boolean
  ) {
    const formGroups = checkboxes.map((dictionary) => {
      const baseForm: FormBase = {
        isSelected: dictionary.selected,
        value: dictionary.value,
        name: dictionary.name,
      };

      if (includeListTypeId && dictionary.listTypeId) {
        baseForm['listTypeId'] = [dictionary.listTypeId];
      }

      return this.formBuilder.group(baseForm);
    });

    this.formingReportForm.setControl(
      formArrayName,
      this.formBuilder.array(formGroups)
    );
  }

  toggleAllCheckboxes() {
    this.areListTypePeroidReportCheckboxesAllSelected =
      !this.areListTypePeroidReportCheckboxesAllSelected;
    const checkboxesArray = this.listTypePeroidReportCheckboxesArray;
    checkboxesArray.controls.forEach((checkboxGroup) => {
      checkboxGroup.patchValue({
        isSelected: this.areListTypePeroidReportCheckboxesAllSelected,
      });
    });
  }

  private setupMutualExclusion(
    checkboxArray: FormArray,
    firstCheckboxValue: string,
    secondCheckboxValue: string
  ) {
    const firstIndex = this.averageScoreCheckboxes.findIndex(
      (cb) => cb.value === firstCheckboxValue
    );
    const secondIndex = this.averageScoreCheckboxes.findIndex(
      (cb) => cb.value === secondCheckboxValue
    );

    if (firstIndex !== -1 && secondIndex !== -1) {
      const firstCheckboxControl = checkboxArray
        .at(firstIndex)
        .get('isSelected') as FormControl;
      const secondCheckboxControl = checkboxArray
        .at(secondIndex)
        .get('isSelected') as FormControl;

      firstCheckboxControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((selected: boolean) => {
          if (selected && !secondCheckboxControl.disabled) {
            secondCheckboxControl.setValue(false);
            secondCheckboxControl.disable();
          } else if (!selected && secondCheckboxControl.disabled) {
            secondCheckboxControl.enable();
          }
        });

      secondCheckboxControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((selected: boolean) => {
          if (selected && !firstCheckboxControl.disabled) {
            firstCheckboxControl.setValue(false);
            firstCheckboxControl.disable();
          } else if (!selected && firstCheckboxControl.disabled) {
            firstCheckboxControl.enable();
          }
        });
    }
  }

  public trackCheckboxChanges() {
    const averageScoreArray = this.formingReportForm.get(
      'averageScoreCheckboxesArray'
    ) as FormArray;
    const peroidReportArray = this.formingReportForm.get(
      'peroidReportCheckboxesArray'
    ) as FormArray;

    // Для averageScoreCheckboxesArray
    this.setupMutualExclusion(
      averageScoreArray,
      'only_test_call',
      'exept_test_call'
    );

    // Для peroidReportCheckboxesArray
    this.setupMutualExclusion(
      peroidReportArray,
      'only_test_call',
      'exept_test_call'
    );
  }

  getCheckboxIsSelected(checkboxesArray: FormArray, checkboxValue: string) {
    return checkboxesArray.value?.find(
      (checkbox: FormControl) => checkbox.value === checkboxValue
    ).isSelected;
  }

  private createReportParams(): ReportParams {
    // const startDate =
    //   this.range.value && this.range.value.start
    //     ? UtilFunctions.formatDate(this.range.value.start, false, '%Y-%m-%d')
    //     : null
    // const endDate =
    //   this.range.value && this.range.value.end
    //     ? UtilFunctions.formatDate(this.range.value.end, false, '%Y-%m-%d')
    //     : null
    const startDate = this.dates.fromDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.fromDate)
      : null;
    const endDate = this.dates.toDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.toDate)
      : null;

    const listType = this.listTypeControl.value.id;
    const reportType = this.reportTypeControl.value.id;
    const ids = {
      contragentIdList: this.contragentListControl.value.map(
        (value: Contragent) => value.id
      ),
      specialistSkkIdList: this.conductedMonitoringListControl.value.map(
        (value: Supervisor) => value.Id
      ),
      supervisorIdList: this.supervisorsListControl.value.map(
        (value: Supervisor) => value.Id
      ),
      recruiterIdList: this.recruiterListControl.value.map(
        (value: Recruiter) => value.Id
      ),
      operatorIdList: this.operatorsListControl.value.map(
        (value: Operator) => value.Id
      ),
    };

    const params: ReportParams = {
      list_type_id: listType,
      start_date: startDate,
      end_date: endDate,
      contragent_list_id: ids.contragentIdList,
      supervisor_list_id: ids.supervisorIdList,
      specialists_skk_list_id: ids.specialistSkkIdList,
      oper_recr_list_id:
        ids.operatorIdList.length !== 0
          ? ids.operatorIdList
          : ids.recruiterIdList,
    };

    if (reportType === 1) {
      params['show_pib_oper_recr'] = this.getCheckboxIsSelected(
        this.listTypePeroidReportCheckboxesArray,
        'operatorPib'
      );
      Object.assign(
        params,
        this.generateCheckboxParams(
          this.listTypePeroidReportCheckboxes,
          this.listTypePeroidReportCheckboxesArray
        )
      );
      Object.assign(
        params,
        this.generateCheckboxParams(
          this.peroidReportCheckboxes,
          this.peroidReportCheckboxesArray
        )
      );
    } else if (reportType === 2) {
      params['show_pib_oper_recr'] = this.getCheckboxIsSelected(
        this.listTypeAverageScoreCheckboxesArray,
        'operatorPib'
      );
      Object.assign(
        params,
        this.generateCheckboxParams(
          this.listTypeAverageScoreCheckboxes,
          this.listTypeAverageScoreCheckboxesArray
        )
      );
      Object.assign(
        params,
        this.generateCheckboxParams(
          this.averageScoreCheckboxes,
          this.averageScoreCheckboxesArray
        )
      );
    }

    return params;
  }

  private generateCheckboxParams(
    checkboxes: CheckboxItem[],
    checkboxesArray: FormArray
  ): CheckboxParams {
    const excludeValues = ['operatorPib', 'hrPib'];
    return checkboxes.reduce<CheckboxParams>((acc, checkbox) => {
      if (!excludeValues.includes(checkbox.value)) {
        const checkboxControl = checkboxesArray.at(
          checkboxes.findIndex((cb) => cb.value === checkbox.value)
        );
        acc[checkbox.value] = checkboxControl.enabled
          ? checkboxControl.get('isSelected')?.value
          : false;
      }
      return acc;
    }, {});
  }

  showReport() {
    const params = this.createReportParams();
    this.loading.set(true);
    if (this.reportTypeControl.value.id === 1) {
      this.qualityHttpService
        .startReportByPeriod(params)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading.set(false))
        )
        .subscribe((data) => {
          this.generatedReport = data;
          this.tableData.set(data);
        });
    }
    if (this.reportTypeControl.value.id === 2) {
      this.qualityHttpService
        .startReportByGpa(params)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading.set(false))
        )
        .subscribe((data) => {
          this.generatedReport = data;
          this.tableData.set(data);
        });
    }
  }

  downloadReport() {
    // const startDate =
    //   this.range.value && this.range.value.start
    //     ? UtilFunctions.formatDate(this.range.value.start, false, '%Y-%m-%d')
    //     : null
    // const endDate =
    //   this.range.value && this.range.value.end
    //     ? UtilFunctions.formatDate(this.range.value.end, false, '%Y-%m-%d')
    //     : null
    const startDate = this.dates.fromDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.fromDate)
      : null;
    const endDate = this.dates.toDate
      ? UtilFunctions.ngbDateStructToStringDate(this.dates.toDate)
      : null;

    if (startDate && endDate) {
      this.qualityHttpService.downloadFile(
        `Загальний звіт за період ${startDate} - ${endDate}`,
        startDate,
        endDate,
        this.generatedReport
      );
    }
  }
}
