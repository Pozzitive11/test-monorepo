import { DestroyRef, Injectable, inject } from '@angular/core';
import { QualityHttpService } from './quality-http.service';
import { Observable, Subject, catchError, forkJoin, map, of } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  CheckboxMark,
  ConversationLengthList,
  SelectList,
} from '../models/monitoring.models';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';
interface LoadInitialDataResult {
  discountsList: SelectList[];
  callProblemsList: SelectList[];
  conversationTypesList: SelectList[];
  conversationLengthList: SelectList[];
  contactWithList: SelectList[];
}

@Injectable({
  providedIn: 'root',
})
export class QualityMonitoringService {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageHandlingService);
  private readonly router = inject(Router);
  discountsList: SelectList[];
  callProblemsList: SelectList[];
  conversationTypesList: SelectList[];
  conversationLengthList: ConversationLengthList[];
  contactWithList: SelectList[];
  callTypesList: SelectList[];
  callResultList: SelectList[];

  employeeRoleNumber: number;
  displayedReestrName: string;
  displayedReestrNumber: number;
  displayedReestrNameContragent: string;
  displayedReestrNameContragentRUS: string;
  isInvalidNKS = false;

  ratingsArray: number[] = [];
  penaltiesArray: number[] = [];

  createMonitoringForm(): FormGroup {
    return this.formBuilder.group({
      nks: [''],
      testCall: [false],
      callId: ['', [Validators.required]],
      phone: ['', [Validators.maxLength(12)]],
      strongSides: [''],
      weakSides: [''],
      contactWith: [null],
      callResult: [null],
      callTypes: [null],
      discounts: [null],
      callProblems: [null],
      conversationDate: [''],
      conversationType: [null],
      conversationLength: [null],
      comment: [''],
      checkboxesDictionariesArray: new FormArray([]),
      checkboxesPenaltiesArray: new FormArray([]),
    });
  }
  loadInitialData(): Observable<LoadInitialDataResult> {
    return forkJoin({
      discountsList: this.qualityHttpService.getFindListDiscount(),
      callProblemsList: this.qualityHttpService.getFindListCallProblem(),
      conversationTypesList: this.qualityHttpService.getCallTypes(),
      conversationLengthList: this.qualityHttpService.getFindListCallLength(),
      contactWithList: this.qualityHttpService.getFindListContact(),
    }).pipe(
      map((results: LoadInitialDataResult) => {
        this.discountsList = results.discountsList;
        this.callProblemsList = results.callProblemsList;
        this.conversationTypesList = results.conversationTypesList;
        this.conversationLengthList = results.conversationLengthList;
        this.contactWithList = results.contactWithList;
        return results;
      })
    );
  }

  loadCallTypesList() {
    this.qualityHttpService
      .getFindListType(this.employeeRoleNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.callTypesList = data;
      });
  }

  setCallDuration(
    durationInSeconds: number
  ): ConversationLengthList | undefined {
    return this.conversationLengthList.find(
      (item) =>
        item.MaxSeconds !== undefined && durationInSeconds <= item.MaxSeconds!
    );
  }

  loadCallResultList(contactWithControlValueName: string | null) {
    if (this.employeeRoleNumber === 1 && contactWithControlValueName) {
      this.qualityHttpService
        .getCallResultList(1, contactWithControlValueName)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => (this.callResultList = data));
    }
    if (this.employeeRoleNumber === 2) {
      this.qualityHttpService
        .getCallResultList(2, '')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => (this.callResultList = data));
    }
  }

  calculateTotalCoefficient(data: CheckboxMark[]): number {
    return data.reduce(
      (acc, { isSelected, coefficient }) =>
        isSelected ? acc + coefficient : acc,
      0
    );
  }

  setEmployeeRoleNumber(employeeRole: string): number {
    return employeeRole === 'Оператор' ||
      employeeRole === 'Для запросов' ||
      employeeRole === 'Супервізор'
      ? 1
      : 2;
  }

  navigateToMonitoringPage(
    messageText: string,
    monitoringId: number,
    monitoringListType: number
  ) {
    this.messageService.sendInfo(messageText + monitoringId);
    const queryParams = {
      MonitoringId: monitoringId,
      Role: monitoringListType,
    };
    this.router.navigate(['/quality-control/show-edited-monitoring'], {
      queryParams,
    });
  }
  setupTestCallValueChanges(
    testCallControl: FormControl,
    callIdControl: FormControl
  ) {
    testCallControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isChecked) => {
        if (isChecked) {
          callIdControl.setValue('тест');
          callIdControl.disable();
        } else {
          callIdControl.setValue('');
          callIdControl.enable();
        }
      });
  }
  getNksInfo(nksControl: FormControl) {
    nksControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.qualityHttpService
          .getNksList(value)
          .pipe(
            catchError((err) => {
              this.isInvalidNKS = true;
              return of(null);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((data) => {
            if (data) {
              this.displayedReestrName = data['ReestrName'];
              this.displayedReestrNumber = data['ReestrRNumber'];
              this.displayedReestrNameContragent = data['ContragentName'];
              this.displayedReestrNameContragentRUS = data['ContragentNameRUS'];
              this.isInvalidNKS = false;
            }
          });
      });
  }

  setRatings(monitoringId: number) {
    this.ratingsArray.forEach((rating) => {
      const obj = {
        MonitoringId: monitoringId,
        ScoreTypeId: rating,
      };
      this.qualityHttpService.sendScoreId(obj).subscribe();
    });
  }
  setPenalties(monitoringId: number) {
    this.penaltiesArray.forEach((rating) => {
      const obj = {
        MonitoringId: monitoringId,
        FineTypeId: rating,
      };
      this.qualityHttpService.sendPenaltiesId(obj).subscribe();
    });
  }
}
