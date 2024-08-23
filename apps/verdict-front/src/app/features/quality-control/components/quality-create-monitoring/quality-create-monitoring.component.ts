import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { ActivatedRoute } from '@angular/router'

import { QualityHttpService } from '../../services/quality-http.service'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { catchError, of } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgSelectModule } from '@ng-select/ng-select'
import { QualityMonitoringService } from '../../services/quality-monitoring.service'
import { CheckboxMark, Mark, Penalty } from '../../models/monitoring.models'
import { Call } from '../../models/calls.model'
import { UserFromDB } from '../../models/user.model'
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service'
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions'

@Component({
  selector: 'app-quality-create-monitoring',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './quality-create-monitoring.component.html',
  styleUrls: ['./quality-create-monitoring.component.css']
})
export class QualityCreateMonitoringComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService)
  protected qualityMonitoringService = inject(QualityMonitoringService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly route = inject(ActivatedRoute)
  private readonly formBuilder = inject(FormBuilder)
  private readonly destroyRef = inject(DestroyRef)

  @Input() callInfo: Call | null
  @Input() operatorInfo: UserFromDB | null

  createMonitoringForm: FormGroup

  employeeName: string
  employeeRole: string
  employeeId: string
  employeeLogin: string

  currentDate = UtilFunctions.formatDate(new Date())
  isInvalidNKS = false

  monitoringDictionariesList: Mark[]
  monitoringPenaltiesList: Penalty[]

  totalCoefficient = 0
  totalPenalty = 0

  monitoringId: number
  listType: number

  displayedReestrName: string
  displayedReestrNumber: number
  displayedReestrNameContragent: string
  displayedReestrNameContragentRUS: string

  isSubmitting = false

  get nksControl(): FormControl {
    return this.createMonitoringForm.get('nks') as FormControl
  }
  get testCallControl(): FormControl {
    return this.createMonitoringForm.get('testCall') as FormControl
  }
  get callIdControl(): FormControl {
    return this.createMonitoringForm.get('callId') as FormControl
  }
  get phoneControl(): FormControl {
    return this.createMonitoringForm.get('phone') as FormControl
  }
  get strongSidesControl(): FormControl {
    return this.createMonitoringForm.get('strongSides') as FormControl
  }
  get weakSidesControl(): FormControl {
    return this.createMonitoringForm.get('weakSides') as FormControl
  }
  get contactWithControl(): FormControl {
    return this.createMonitoringForm.get('contactWith') as FormControl
  }
  get callResultControl(): FormControl {
    return this.createMonitoringForm.get('callResult') as FormControl
  }
  get callTypesControl(): FormControl {
    return this.createMonitoringForm.get('callTypes') as FormControl
  }
  get discountControl(): FormControl {
    return this.createMonitoringForm.get('discounts') as FormControl
  }
  get callProblemsControl(): FormControl {
    return this.createMonitoringForm.get('callProblems') as FormControl
  }
  get conversationDateControl(): FormControl {
    return this.createMonitoringForm.get('conversationDate') as FormControl
  }
  get conversationTypeControl(): FormControl {
    return this.createMonitoringForm.get('conversationType') as FormControl
  }
  get conversationLengthControl(): FormControl {
    return this.createMonitoringForm.get('conversationLength') as FormControl
  }
  get commentControl(): FormControl {
    return this.createMonitoringForm.get('comment') as FormControl
  }
  get checkboxesDictionariesArray(): FormArray {
    return this.createMonitoringForm.get('checkboxesDictionariesArray') as FormArray
  }
  get checkboxesPenaltiesArray(): FormArray {
    return this.createMonitoringForm.get('checkboxesPenaltiesArray') as FormArray
  }

  ngOnInit(): void {
    this.initializeRouteParams()
    this.qualityMonitoringService
      .loadInitialData()
      .pipe(
        catchError(() => {
          this.messageService.sendError('Помилка при завантаженні списків для моніторингу.')
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.callInfo) {
          const callLength = this.qualityMonitoringService.setCallDuration(this.callInfo.Duration)
          this.conversationLengthControl.setValue(callLength)
        }
      })
    this.setInitialForm()
    this.qualityMonitoringService.setupTestCallValueChanges(this.testCallControl, this.callIdControl)
    this.loadDataBasedOnUserRole()
    this.subscribeToContactWithValueChanges()
    this.loadPenaltiesList()
    this.qualityMonitoringService.loadCallResultList(null)
    this.setNksInfo()
    this.qualityMonitoringService.ratingsArray = []
    this.qualityMonitoringService.penaltiesArray = []

    if (this.callInfo && this.callInfo.ContractId) {
      this.getNksInfo(+this.callInfo.ContractId)
    }
  }

  ngOnChanges(): void {
    this.loadDataBasedOnUserRole()
  }

  setInitialForm() {
    // Оголошуємо змінну для зберігання валідаторів для поля nks
    let nksValidators: ValidatorFn[] = []

    // Якщо this.qualityMonitoringService.employeeRoleNumber === 1, додаємо Validators.required до масиву валідаторів
    if (this.qualityMonitoringService.setEmployeeRoleNumber(this.employeeRole) === 1) {
      nksValidators.push(Validators.required)
    }

    // Створюємо форму з валідаторами для поля nks
    this.createMonitoringForm = this.formBuilder.group({
      nks: [this.callInfo?.ContractId || '', nksValidators], // Використовуємо масив nksValidators для встановлення валідаторів
      testCall: [false],
      callId: [this.callInfo?.vrID || '', [Validators.required]],
      phone: [this.callInfo?.PhoneNumber || '', [Validators.maxLength(12)]],
      strongSides: [''],
      weakSides: [''],
      contactWith: [null],
      callResult: [null],
      callTypes: [null],
      discounts: [null],
      callProblems: [null],
      conversationDate: [this.callInfo?.StartTime ? formatDate(this.callInfo.StartTime, 'yyyy-MM-dd', 'en') : null],
      conversationType: [null],
      conversationLength: [null],
      comment: [''],
      checkboxesDictionariesArray: new FormArray([]),
      checkboxesPenaltiesArray: new FormArray([])
    })
  }

  setNksInfo() {
    this.nksControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.getNksInfo(this.nksControl.value)
    })
  }

  getNksInfo(value: number) {
    this.qualityHttpService
      .getNksList(value)
      .pipe(
        catchError(() => {
          this.isInvalidNKS = true
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        if (data) {
          this.displayedReestrName = data['ReestrName']
          this.displayedReestrNumber = data['ReestrRNumber']
          this.displayedReestrNameContragent = data['ContragentName']
          this.displayedReestrNameContragentRUS = data['ContragentNameRUS']
          this.isInvalidNKS = false
        }
      })
  }

  subscribeToContactWithValueChanges() {
    this.contactWithControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value !== null) {
        this.qualityMonitoringService.loadCallResultList(value.Name)
      }
    })
  }
  initializeRouteParams() {
    this.route.queryParams.subscribe((params) => {
      this.employeeId = params['Id']
      this.employeeLogin = params['Login']
      this.employeeName = params['FullName']
      this.employeeRole = params['RoleName']
    })
  }
  loadDataBasedOnUserRole() {
    if (this.operatorInfo) {
      this.qualityMonitoringService.employeeRoleNumber = this.qualityMonitoringService.setEmployeeRoleNumber(
        this.operatorInfo.RoleName
      )
    } else {
      this.qualityMonitoringService.employeeRoleNumber = this.qualityMonitoringService.setEmployeeRoleNumber(
        this.employeeRole
      )
    }
    this.qualityMonitoringService.loadCallTypesList()
    this.loadMonitoringDictionaries()
  }

  loadMonitoringDictionaries() {
    this.qualityHttpService
      .getAllMonitoringDictionaries(this.qualityMonitoringService.employeeRoleNumber)
      .subscribe((data) => {
        this.monitoringDictionariesList = data
        this.initializeCheckboxesArray(data)
      })
  }
  initializeCheckboxesArray(data: Mark[]) {
    const formGroups = data.map((dictionary) =>
      this.formBuilder.group({
        isSelected: [false],
        coefficient: [dictionary.Coefficient],
        id: [dictionary.Id]
      })
    )

    this.createMonitoringForm.setControl('checkboxesDictionariesArray', this.formBuilder.array(formGroups))
    this.subscribeToCheckboxDictionariesValueChanges()
  }
  subscribeToCheckboxDictionariesValueChanges() {
    this.checkboxesDictionariesArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CheckboxMark[]) => {
        this.qualityMonitoringService.ratingsArray = data.filter(({ isSelected }) => isSelected).map(({ id }) => id)

        this.totalCoefficient = this.qualityMonitoringService.calculateTotalCoefficient(data)
      })
  }
  // PENALTIES
  loadPenaltiesList() {
    this.qualityHttpService
      .getMonitoringPenalties(1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.monitoringPenaltiesList = data
        const formGroups = this.monitoringPenaltiesList.map((dictionary) =>
          this.formBuilder.group({
            isSelected: [false],
            coefficient: [dictionary.Penalty],
            id: [dictionary.Id]
          })
        )
        this.createMonitoringForm.setControl('checkboxesPenaltiesArray', this.formBuilder.array(formGroups))
        this.subscribeToCheckboxPenaltiesValueChanges()
      })
  }
  subscribeToCheckboxPenaltiesValueChanges() {
    this.checkboxesPenaltiesArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CheckboxMark[]) => {
        this.qualityMonitoringService.penaltiesArray = data.filter(({ isSelected }) => isSelected).map(({ id }) => id)

        this.totalPenalty = this.qualityMonitoringService.calculateTotalCoefficient(data)
      })
  }

  createMonitoring() {
    const callDescriptionIds =
      this.conversationTypeControl.value?.map((item: { id: number; Name: string }) => item.id) || []

    let monitoringParams
    if (this.qualityMonitoringService.employeeRoleNumber === 1) {
      monitoringParams = {
        CallId: this.callIdControl.value,
        PhoneNumber: this.phoneControl.value,
        UserId: +this.employeeId || this.operatorInfo?.Id,
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
        CallDate: this.conversationDateControl.value || null
      }
    } else {
      monitoringParams = {
        CallId: this.callIdControl.value,
        PhoneNumber: this.phoneControl.value,
        UserId: +this.employeeId || this.operatorInfo?.Id,
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
        CallDate: this.conversationDateControl.value || null
      }
    }

    this.isSubmitting = true
    this.qualityHttpService
      .sendMonit(monitoringParams)
      .pipe(
        catchError(() => {
          this.messageService.sendError('Помилка при створенні моніторингу, перевірте чи усі необхідні поля заповнені.')
          this.messageService.sendError('Перевірте чи усі необхідні поля заповнені.')
          return of(null)
        })
      )
      .subscribe((monitoring) => {
        if (monitoring) {
          this.isSubmitting = false

          this.monitoringId = monitoring.Id
          this.listType = monitoring.ListType
          this.qualityMonitoringService.setRatings(monitoring.Id)
          if (
            this.qualityMonitoringService.employeeRoleNumber === 1 &&
            this.qualityMonitoringService.penaltiesArray.length > 0
          ) {
            this.qualityMonitoringService.setPenalties(monitoring.Id)
          }
          this.qualityMonitoringService.navigateToMonitoringPage(
            'Моніторинг створено та відправлено. Id моніторингу:',
            this.monitoringId,
            this.listType
          )
        }
      })
  }
}
