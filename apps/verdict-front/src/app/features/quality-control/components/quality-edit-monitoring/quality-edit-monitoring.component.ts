import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { QualityHttpService } from '../../services/quality-http.service';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import {
  CallType,
  CheckboxMark,
  Mark,
  MonitoringInfo,
  Penalty,
} from '../../models/monitoring.models';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

interface Score {
  Id: number;
  MonitoringId: number;
  ScoreTypeId: number;
}
interface Fine {
  MonitoringId: number;
  FineTypeId: number;
  Id: number;
}
@Component({
  selector: 'app-quality-edit-monitoring',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './quality-edit-monitoring.component.html',
  styleUrls: ['./quality-edit-monitoring.component.css'],
})
export class QualityEditMonitoringComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  qualityMonitoringService = inject(QualityMonitoringService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  updateMonitoringForm: FormGroup;

  employeeName: string;
  employeeRole: string;
  employeeId: number;
  employeeLogin: string;

  currentDate = UtilFunctions.formatDate(new Date());

  monitoringInfo: MonitoringInfo;

  callTypesList: CallType[];
  monitoringDictionariesList: Mark[];
  monitoringPenaltiesList: Penalty[];

  totalCoefficient = 0;
  totalPenalty = 0;

  monitoringId: number;
  listType: number;

  selectedScoresList: Score[];
  selectedPenaltiesList: Fine[];
  isSubmitting = false;

  get nksControl(): FormControl {
    return this.updateMonitoringForm.get('nks') as FormControl;
  }
  get testCallControl(): FormControl {
    return this.updateMonitoringForm.get('testCall') as FormControl;
  }
  get callIdControl(): FormControl {
    return this.updateMonitoringForm.get('callId') as FormControl;
  }
  get phoneControl(): FormControl {
    return this.updateMonitoringForm.get('phone') as FormControl;
  }
  get strongSidesControl(): FormControl {
    return this.updateMonitoringForm.get('strongSides') as FormControl;
  }
  get weakSidesControl(): FormControl {
    return this.updateMonitoringForm.get('weakSides') as FormControl;
  }
  get contactWithControl(): FormControl {
    return this.updateMonitoringForm.get('contactWith') as FormControl;
  }
  get callResultControl(): FormControl {
    return this.updateMonitoringForm.get('callResult') as FormControl;
  }
  get callTypesControl(): FormControl {
    return this.updateMonitoringForm.get('callTypes') as FormControl;
  }
  get discountControl(): FormControl {
    return this.updateMonitoringForm.get('discounts') as FormControl;
  }
  get callProblemsControl(): FormControl {
    return this.updateMonitoringForm.get('callProblems') as FormControl;
  }
  get conversationDateControl(): FormControl {
    return this.updateMonitoringForm.get('conversationDate') as FormControl;
  }
  get conversationTypeControl(): FormControl {
    return this.updateMonitoringForm.get('conversationType') as FormControl;
  }
  get conversationLengthControl(): FormControl {
    return this.updateMonitoringForm.get('conversationLength') as FormControl;
  }
  get commentControl(): FormControl {
    return this.updateMonitoringForm.get('comment') as FormControl;
  }
  get checkboxesDictionariesArray(): FormArray {
    return this.updateMonitoringForm.get(
      'checkboxesDictionariesArray'
    ) as FormArray;
  }
  get checkboxesPenaltiesArray(): FormArray {
    return this.updateMonitoringForm.get(
      'checkboxesPenaltiesArray'
    ) as FormArray;
  }

  ngOnInit(): void {
    this.initializeRouteParams();
    this.updateMonitoringForm =
      this.qualityMonitoringService.createMonitoringForm();
    this.qualityMonitoringService
      .loadInitialData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.qualityMonitoringService.setupTestCallValueChanges(
      this.testCallControl,
      this.callIdControl
    );

    this.qualityMonitoringService.getNksInfo(this.nksControl);
    this.loadPenaltiesList();
    this.fetchMonitoringInfo()
      .pipe(
        switchMap(() => this.fetchUserInfo(this.employeeId)),
        switchMap(() =>
          this.fetchCallTypesAndResults(
            this.qualityMonitoringService.employeeRoleNumber
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.setInitialScores();
        this.setInitialPenalties();
        this.initializeFormValues();
      });
  }
  fetchMonitoringInfo() {
    return this.qualityHttpService.getMonitoring(this.monitoringId).pipe(
      tap((monitoringData) => {
        this.monitoringInfo = monitoringData;
        this.employeeId = monitoringData.UserId;
      })
    );
  }

  fetchUserInfo(userId: number) {
    return this.qualityHttpService.getUserShortInfo(userId).pipe(
      tap((userInfo) => {
        this.employeeName = userInfo['Користувач'];
        this.employeeRole = userInfo['Роль'];
        this.qualityMonitoringService.employeeRoleNumber =
          this.qualityMonitoringService.setEmployeeRoleNumber(
            this.employeeRole
          );
      })
    );
  }
  fetchCallTypesAndResults(roleNumber: number) {
    return forkJoin({
      callTypes: this.qualityHttpService.getFindListType(roleNumber),
      callResultList:
        roleNumber === 2
          ? this.qualityHttpService.getCallResultList(2, '')
          : of([]),
    }).pipe(
      tap(({ callTypes, callResultList }) => {
        if (this.qualityMonitoringService.employeeRoleNumber === 2) {
          this.qualityMonitoringService.callResultList = callResultList;

          const callResult = callResultList.find(
            (item: CallType) => item.id === this.monitoringInfo.CallResultId
          );
          this.callResultControl.setValue(callResult);
        }
        this.callTypesList = callTypes;
        const callType = callTypes.find(
          (item: CallType) => item.id === this.monitoringInfo.CallTypeId
        );
        this.callTypesControl.setValue(callType);
      })
    );
  }
  initializeFormValues() {
    if (
      this.monitoringInfo.ContactWithId &&
      this.qualityMonitoringService.employeeRoleNumber === 1
    ) {
      const contactWith = this.qualityMonitoringService.contactWithList.find(
        (item) => item.id === this.monitoringInfo.ContactWithId
      );
      if (contactWith) {
        this.qualityHttpService
          .getCallResultList(1, contactWith.Name)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.qualityMonitoringService.callResultList = data;
            const callResult =
              this.qualityMonitoringService.callResultList.find(
                (item: CallType) => item.id === this.monitoringInfo.CallResultId
              );

            this.callResultControl.setValue(callResult);
          });
      }
      this.contactWithControl.setValue(contactWith);
    }
    this.setControlValues();
  }
  setInitialScores() {
    this.qualityHttpService
      .getAllMonitoringDictionaries(
        this.qualityMonitoringService.employeeRoleNumber
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.monitoringDictionariesList = data;

        this.qualityHttpService
          .getMonitListforMonitId(this.monitoringId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((selectedScores) => {
            this.selectedScoresList = selectedScores;
            const selectedScoresIds = this.selectedScoresList.map(
              (score) => score.ScoreTypeId
            );

            this.monitoringDictionariesList.forEach((dictionary, index) => {
              const isSelected = selectedScoresIds.includes(dictionary.Id);

              // Отримати доступ до відповідного FormGroup у FormArray
              const checkboxGroup = this.checkboxesDictionariesArray.at(
                index
              ) as FormGroup;

              // Оновити значення isSelected залежно від того, чи вибраний поточний рейтинг
              checkboxGroup.patchValue({ isSelected: isSelected });
            });
          });

        this.initializeCheckboxesArray(this.monitoringDictionariesList);
      });
  }

  setInitialPenalties() {
    this.qualityHttpService
      .getMonitoringPenaltiesList(
        this.qualityMonitoringService.employeeRoleNumber
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.qualityHttpService
          .getMonitoringPenaltyListByMonitId(this.monitoringId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((selectedPenaltiesList) => {
            this.selectedPenaltiesList = selectedPenaltiesList;
            const selectedPenaltiesIds = this.selectedPenaltiesList.map(
              (score) => score.FineTypeId
            );

            this.monitoringPenaltiesList.forEach((dictionary, index) => {
              const isSelected = selectedPenaltiesIds.includes(dictionary.Id);

              // Отримати доступ до відповідного FormGroup у FormArray
              const checkboxGroup = this.checkboxesPenaltiesArray.at(
                index
              ) as FormGroup;

              // Оновити значення isSelected залежно від того, чи вибраний поточний рейтинг
              checkboxGroup.patchValue({ isSelected: isSelected });
            });
          });
      });
  }

  setControlValues() {
    this.nksControl.setValue(this.monitoringInfo.ContractId);
    this.callIdControl.setValue(this.monitoringInfo.CallId);
    if (this.callIdControl.value === 'тест') {
      this.testCallControl.setValue(true);
    }
    this.phoneControl.setValue(this.monitoringInfo.PhoneNumber);
    this.strongSidesControl.setValue(this.monitoringInfo.Strong);
    this.weakSidesControl.setValue(this.monitoringInfo.Weak);

    if (this.monitoringInfo.DiscountMarkId) {
      const discount = this.qualityMonitoringService.discountsList.find(
        (item) => item.id === this.monitoringInfo.DiscountMarkId
      );
      this.discountControl.setValue(discount);
    }
    if (this.monitoringInfo.CallProblemId) {
      const callProblem = this.qualityMonitoringService.callProblemsList.find(
        (item) => item.id === this.monitoringInfo.CallProblemId
      );
      this.callProblemsControl.setValue(callProblem);
    }

    this.conversationTypeControl.setValue(
      this.monitoringInfo.CallDescriptionIds
    );

    if (this.monitoringInfo.CallLengthId) {
      const conversationLength =
        this.qualityMonitoringService.conversationLengthList.find(
          (item) => item.id === this.monitoringInfo.CallLengthId
        );
      this.conversationLengthControl.setValue(conversationLength);
    }
    this.conversationDateControl.setValue(this.monitoringInfo.CallDate);
    this.commentControl.setValue(this.monitoringInfo.Comment);
  }

  initializeRouteParams() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.monitoringId = params['monitID'];
        this.employeeName = params['user'];
      });
  }

  initializeCheckboxesArray(data: Mark[]) {
    const formGroups = data.map((dictionary) =>
      this.formBuilder.group({
        isSelected: [false],
        coefficient: [dictionary.Coefficient],
        id: [dictionary.Id],
      })
    );

    this.updateMonitoringForm.setControl(
      'checkboxesDictionariesArray',
      this.formBuilder.array(formGroups)
    );
    this.subscribeToCheckboxDictionariesValueChanges();
  }
  subscribeToCheckboxDictionariesValueChanges() {
    this.checkboxesDictionariesArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CheckboxMark[]) => {
        this.qualityMonitoringService.ratingsArray = data
          .filter(({ isSelected }) => isSelected)
          .map(({ id }) => id);

        this.totalCoefficient =
          this.qualityMonitoringService.calculateTotalCoefficient(data);
      });
  }
  // PENALTIES
  loadPenaltiesList() {
    this.qualityHttpService
      .getMonitoringPenalties(1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.monitoringPenaltiesList = data;
        const formGroups = this.monitoringPenaltiesList.map((dictionary) =>
          this.formBuilder.group({
            isSelected: [false],
            coefficient: [dictionary.Penalty],
            id: [dictionary.Id],
          })
        );
        this.updateMonitoringForm.setControl(
          'checkboxesPenaltiesArray',
          this.formBuilder.array(formGroups)
        );
        this.subscribeToCheckboxPenaltiesValueChanges();
      });
  }
  subscribeToCheckboxPenaltiesValueChanges() {
    this.checkboxesPenaltiesArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CheckboxMark[]) => {
        this.qualityMonitoringService.penaltiesArray = data
          .filter(({ isSelected }) => isSelected)
          .map(({ id }) => id);

        this.totalPenalty =
          this.qualityMonitoringService.calculateTotalCoefficient(data);
      });
  }

  deleteRatings(monitoringId: number) {
    const scores = this.monitoringDictionariesList.filter((score) =>
      this.selectedScoresList.some(
        (selectedScore) => score.Id === selectedScore.ScoreTypeId
      )
    );
    scores.forEach((rating) => {
      const obj = {
        MonitoringId: monitoringId,
        ScoreTypeId: rating.Id,
      };
      this.qualityHttpService.removeScoreId(obj).subscribe();
    });
  }
  deletePenalties(monitoringId: number) {
    const penalties = this.monitoringPenaltiesList.filter((score) =>
      this.selectedPenaltiesList.some(
        (selectedScore) => score.Id === selectedScore.FineTypeId
      )
    );
    penalties?.forEach((rating) => {
      const obj = {
        MonitoringId: monitoringId,
        FineTypeId: rating.Id,
      };
      this.qualityHttpService.removePenaltyId(obj).subscribe();
    });
  }
  updateMonitoring() {
    this.deleteRatings(this.monitoringId);
    if (this.qualityMonitoringService.employeeRoleNumber === 1) {
      this.deletePenalties(this.monitoringId);
    }
    const callDescriptionIds =
      this.conversationTypeControl.value?.map((item: CallType) => item.id) ||
      [];

    let objStart;
    if (this.qualityMonitoringService.employeeRoleNumber === 1) {
      objStart = {
        CallId: this.callIdControl.value,
        PhoneNumber: this.phoneControl.value,
        UserId: +this.employeeId,
        ContractId: this.nksControl.value,
        Strong: this.strongSidesControl.value,
        Weak: this.weakSidesControl.value,
        ContactWithId: this.contactWithControl.value?.id || null,
        CallResultId: this.callResultControl.value?.id || null,
        CallTypeId: this.callTypesControl.value?.id || null,
        DiscountMarkId: this.discountControl.value?.id || null,
        Comment: this.commentControl.value,
        ListType: 1,
        CallProblemId: this.callProblemsControl.value?.id || null,
        CallLengthId: this.conversationLengthControl.value?.id || null,
        CallDescriptionIds: callDescriptionIds,
        CallDate: this.conversationDateControl.value || null,
      };
    } else {
      objStart = {
        CallId: this.callIdControl.value,
        PhoneNumber: this.phoneControl.value,
        UserId: +this.employeeId,
        ContractId: 1,
        Strong: this.strongSidesControl.value,
        Weak: this.weakSidesControl.value,
        ContactWithId: 1,
        CallResultId: this.callResultControl.value?.id || null,
        CallTypeId: this.callTypesControl.value?.id || null,
        DiscountMarkId: 1,
        Comment: this.commentControl.value,
        ListType: 2,
        CallProblemId: this.callProblemsControl.value?.id || null,
        CallLengthId: this.conversationLengthControl.value?.id || null,
        CallDate: this.conversationDateControl.value || null,
      };
    }
    this.isSubmitting = true;

    this.qualityHttpService
      .updateMonitoring(this.monitoringId, objStart)
      .pipe(
        catchError((error) => {
          this.messageService.sendError(
            'Помилка при редагуванні моніторнгу, перевірте чи усі необхідні поля заповнені.'
          );
          this.messageService.sendError(
            'Перевірте чи усі необхідні поля заповнені.'
          );
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.isSubmitting = false;
          this.listType = data['ListType'];
        }
        this.qualityMonitoringService.setRatings(this.monitoringId);
        if (
          this.qualityMonitoringService.employeeRoleNumber === 1 &&
          this.qualityMonitoringService.penaltiesArray.length > 0
        ) {
          this.qualityMonitoringService.setPenalties(this.monitoringId);
        }
        this.qualityMonitoringService.navigateToMonitoringPage(
          'Моніторінг відредаговано за id:',
          this.monitoringId,
          this.monitoringInfo.ListType
        );
      });
  }
  deleteMonitoring() {
    this.qualityHttpService
      .deleteMonitoring(this.monitoringId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.messageService.sendInfo(
          'Моніторінг видалено за id:' + this.monitoringId
        );
        this.router.navigate(['/quality-control/quality-control-user']);
      });
  }
}
