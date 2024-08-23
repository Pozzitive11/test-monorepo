import { formatDate } from '@angular/common'
import { computed, inject, Injectable, signal } from '@angular/core'
import { from, mergeMap, Observable, tap } from 'rxjs'
import { numericAggregationFunctions } from '../../../shared/components/pivot-table/utils/aggregation.functions'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { dateFromString, periodFromDate } from '../../../shared/utils/dates.util'
import { PpPaymentDocsVerificationByPeriodModel } from '../models/pp-payment-docs-verification-by-period.model'
import { PpVerificationModel } from '../models/pp-verification.model'
import { PpFiltersService } from './pp-filters.service'
import { PpHttpClientService } from './pp-http-client.service'
import { PpModalManageService } from './pp-modal-manage.service'
import { TValue } from '../../../shared/models/basic-types'

type TLoading = { contractPayments: boolean, processingPayments: boolean }

@Injectable({
  providedIn: 'root'
})
export class PpVerificationDataService {
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)

  private readonly filtersService = inject(PpFiltersService)
  private readonly modalManageService = inject(PpModalManageService)

  loading = signal<TLoading>({ contractPayments: false, processingPayments: false })
  activeTab = signal<'contractPayments' | 'paymentDocs'>('contractPayments')


  // ----------------- Contract payments verification -----------------
  onlyFactoring = signal<boolean>(true)

  contractPayments = signal<PpVerificationModel[]>([])
  processingPayments = signal<PpVerificationModel[]>([])

  readonly sep = '|'
  rowAliases = signal<string[]>([
    'Період',
    'Проєкт',
    'RNumber',
    'Кількість платежів',
    'Сума платежів',
    'Тип звірки',
    'Загальна кількість платежів',
    'Загальна сума платежів'
  ])
  index = signal<string[]>(['Період'])
  values = signal<string[]>([
    'Кількість платежів',
    'Сума платежів',
    'Загальна кількість платежів',
    'Загальна сума платежів'
  ])
  aggFunctions = signal<((val: TValue[]) => TValue)[]>([
    numericAggregationFunctions.sum,
    numericAggregationFunctions.sum,
    numericAggregationFunctions.sum,
    numericAggregationFunctions.sum
  ])
  resultAliases = signal<string[]>([
    'Кількість платежів',
    'Сума платежів',
    'Загальна кількість платежів',
    'Загальна сума платежів'
  ])
  rowPercentagesKeys = signal<[string, string, string][]>([
    ['Кількість платежів', 'Загальна кількість платежів', 'Відсоток кількості нерозібраних платежів'],
    ['Сума платежів', 'Загальна сума платежів', 'Відсоток суми нерозібраних платежів']
  ])


  // ----------------- Payment docs verification -----------------

  paymentDocsVerification = signal<PpPaymentDocsVerificationByPeriodModel[]>([])
  paymentDocsVerificationPeriods = computed(() => {
    return this.paymentDocsVerification()
      .map(item => periodFromDate(dateFromString(item.Period, true)!))
  })
  paymentDocsVerificationSelectedPeriods = signal<string[]>([])
  paymentDocsVerificationFilteredData = computed(() => {
    const selectedPeriods = this.paymentDocsVerificationSelectedPeriods()
    return this.paymentDocsVerification().filter(item => {
      const date = dateFromString(item.Period, true)
      if (date === null)
        return false

      return selectedPeriods.includes(periodFromDate(date))
    })
  })
  paymentDocsVerificationSelectedPeriodsDates = computed(() => {
    return this.paymentDocsVerificationSelectedPeriods()
      .map(period => {
        const [month, year] = period.split('.')
        return formatDate(new Date(+year, +month - 1), 'YYYY-MM-dd', 'en-US')
      })
  })

  // ----------------- Grouped verifications info -----------------
  paymentDocsVerificationNoRequestId = computed(() => {
    return this.paymentDocsVerificationFilteredData()
      .map(item => item.NoRequestId)
  })
  paymentDocsVerificationNoDocumentAttached = computed(() => {
    return this.paymentDocsVerificationFilteredData()
      .map(item => item.NoDocumentAttached)
  })
  paymentDocsVerificationNoFilledInformation = computed(() => {
    return this.paymentDocsVerificationFilteredData()
      .map(item => item.NoFilledInformation)
  })
  paymentDocsVerificationTotal = computed(() => {
    return this.paymentDocsVerificationFilteredData()
      .map(item => item.Total)
  })


  loadFullVerificationData() {
    this.loading.update(loading => ({ ...loading, contractPayments: true }))
    from([
      this.httpService.getContractPaymentsVerification(
        'CONTRACT_PAYMENTS',
        this.filtersService.fromDate(), this.filtersService.toDate(),
        this.onlyFactoring()
      )
        .pipe(tap(data => this.contractPayments.set(data))),

      this.httpService.getContractPaymentsVerification(
        'PAYMENTS_PROCESSING',
        this.filtersService.fromDate(), this.filtersService.toDate(),
        this.onlyFactoring()
      )
        .pipe(tap(data => this.processingPayments.set(data)))
    ])
      .pipe(mergeMap(request => request))
      .subscribe({
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading.update(loading => ({ ...loading, contractPayments: false }))
        },
        complete: () => this.loading.update(loading => ({ ...loading, contractPayments: false }))
      })

  }

  loadPaymentDocsVerification() {
    this.loading.update(loading => ({ ...loading, processingPayments: true }))
    this.httpService.getPaymentDocsVerification(null, null).subscribe({
      next: data => this.paymentDocsVerification.set(data),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.loading.update(loading => ({ ...loading, processingPayments: false }))
      },
      complete: () => {
        this.messageService.sendInfo('Дані завантажено')
        this.loading.update(loading => ({ ...loading, processingPayments: false }))
      }
    })
  }

  loadPayments(obs: Observable<string[]>) {
    const activeTab = this.activeTab()
    const loadCallback = () => {
      this.loading.update(loading => {
        console.log('loading', activeTab)
        if (activeTab === 'contractPayments')
          return { ...loading, contractPayments: false }
        else
          return { ...loading, processingPayments: false }
      })
    }

    obs.subscribe({
      next: async (ids) => await this.modalManageService.openOptionsModal(ids, loadCallback),
      error: async (err) => {
        await this.messageService.alertError(err)
        loadCallback()
      }
    })
  }

}
