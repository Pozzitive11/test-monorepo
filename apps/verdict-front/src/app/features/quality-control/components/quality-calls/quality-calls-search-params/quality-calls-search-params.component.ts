import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CallSearchParameters } from '../../../models/calls.model';
import { QualityCallsService } from '../../../services/quality-calls.service';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'app-quality-calls-search-params',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  templateUrl: './quality-calls-search-params.component.html',
  styleUrls: ['./quality-calls-search-params.component.css'],
})
export class QualityCallsSearchParamsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  protected qualityCallsService = inject(QualityCallsService);
  searchParamsForm: FormGroup;
  operators = [];
  get startDateControl(): FormControl {
    return this.searchParamsForm.get('startDate') as FormControl;
  }
  get endDateControl(): FormControl {
    return this.searchParamsForm.get('endDate') as FormControl;
  }
  get operatorLoginControl(): FormControl {
    return this.searchParamsForm.get('operatorLogin') as FormControl;
  }
  get phoneControl(): FormControl {
    return this.searchParamsForm.get('phone') as FormControl;
  }
  get minDurationControl(): FormControl {
    return this.searchParamsForm.get('minDuration') as FormControl;
  }
  get maxDurationControl(): FormControl {
    return this.searchParamsForm.get('maxDuration') as FormControl;
  }
  get limitControl(): FormControl {
    return this.searchParamsForm.get('limit') as FormControl;
  }
  ngOnInit(): void {
    this.createSearchCallsForm();
  }
  getTodayDateAtStart(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  getTodayDateAtEnd(): Date {
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    return tomorrow;
  }

  createSearchCallsForm() {
    this.searchParamsForm = this.formBuilder.group({
      startDate: [
        UtilFunctions.createNgbDateFromDate(this.getTodayDateAtStart()),
      ],
      endDate: [UtilFunctions.createNgbDateFromDate(this.getTodayDateAtEnd())],
      operatorLogin: [''],
      phone: [''],
      minDuration: [''],
      maxDuration: [''],
      limit: [100],
    });
  }

  searchCalls() {
    if (this.searchParamsForm.valid) {
      const startDate = UtilFunctions.ngbDateToDate(
        this.startDateControl.value
      );
      const finishDate = UtilFunctions.ngbDateToDate(this.endDateControl.value);

      if (startDate) startDate.setHours(startDate.getHours() + 3);
      if (finishDate) {
        finishDate.setHours(23, 59, 59, 999);
      }

      let phone = this.phoneControl.value;
      if (phone) {
        phone = phone.toString().slice(-10);
      }

      const searchParams: CallSearchParameters = {
        StartDate: startDate?.toISOString() || null,
        FinishDate: finishDate?.toISOString() || null,
        TelNumber: phone || null,
        MinDuration: this.minDurationControl.value || null,
        MaxDuration: this.maxDurationControl.value || null,
        Login: this.operatorLoginControl.value || null,
        Limit: this.limitControl.value || 100,
        IsDetails: false,
      };

      this.qualityCallsService.searchCalls(searchParams);
    }
  }
}
