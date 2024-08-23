import { inject, Injectable } from '@angular/core'
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { dcAgreeTypeNames } from '../models/dc-agree-type.names'
import { BehaviorSubject } from 'rxjs'
import { roundNumber } from '../../../shared/utils/math.util'
import { dateFromString } from '../../../shared/utils/dates.util'

@Injectable({
  providedIn: 'root'
})
export class DcPromotionsFiltersService {
  private readonly calendar = inject(NgbCalendar)

  loading$ = new BehaviorSubject<boolean>(false)

  hiddenCols: string[] = ['id']
  checkedRows: number[] = []
  page: number = 1
  rowsPerPage: number = 30
  shownDataLength: number = 0

  agreeTypesFilter: string[] = []
  sendingWayTypesFilter: string[] = []
  approvedDocumentsFilter: any[] = []
  onlyNew: boolean = true
  useNewInfo: boolean = true
  onlySubmitted: boolean = false
  getCalculations: boolean = true

  displayAllRequests: boolean = true
  documentsVerification: boolean = false
  shippingSubmitted: boolean = false

  general = true
  onlyDocuments = false
  sending = false

  textFilters: { col: string; value: string }[] = []
  dateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: this.calendar.getPrev(this.calendar.getToday(), 'd', 14),
    toDate: this.calendar.getToday()
  }
  datesRange: { MinDate: NgbDate | null; MaxDate: NgbDate | null } = {
    MinDate: this.calendar.getPrev(this.calendar.getToday(), 'm', 1),
    MaxDate: this.calendar.getToday()
  }
  paymentSumFilter: boolean = false
  limitDateFilter: boolean = false

  shownData$ = new BehaviorSubject<{ [key: string]: any }[]>([])
  filteredData: { [key: string]: any }[] = []
  agreementTypes = [
    'Інформаційний лист',
    'Договір факторингу',
    'Витяг',
    'Угода про списання частини боргу',
    'Гарантійний лист'
  ]
  columns = {
    agreement: 'Наявність узгодження',
    approved: 'Документ Затверджено',
    lastPaymentDate: 'Дата останнього платежу',
    limitDate: 'Гранична дата по узгодженню',
    sumToPay: 'Сума до сплати',
    payedSum: 'Платежі після ДС/РС (всього)',
    payedSumFact: 'Платежі після ДС/РС (фактичні)',
    sendingWay: 'Шляхи відправки',
    documentExportDate: 'Дата експорту документа'
  }

  get maxPage(): number {
    return Math.floor(this.shownDataLength / this.rowsPerPage) + (this.shownDataLength % this.rowsPerPage ? 1 : 0)
  }

  private clearFilters() {
    if (this.agreeTypesFilter.length && !this.general) {
      this.agreeTypesFilter = []
    }
    if (this.approvedDocumentsFilter.length && !this.documentsVerification) {
      this.approvedDocumentsFilter = []
    }
  }

  filterData(tableData: { [p: string]: any }[]) {
    this.clearFilters()
    let partOfData = tableData.slice()

    if (this.onlySubmitted) partOfData = partOfData.filter((value) => !value['Причина неподачі'])
    if (this.agreeTypesFilter.length) {
      partOfData = partOfData.filter((dataItem) => {
        const agreementValue = dataItem[this.columns.agreement]
        if (agreementValue === null) {
          return this.agreeTypesFilter.some((type) => dcAgreeTypeNames.submitted.includes(type))
        }
        return this.agreeTypesFilter.includes(agreementValue)
      })
    }

    if (this.documentsVerification) {
      partOfData = partOfData.filter((dataItem) => {
        const agreementValue = dataItem[this.columns.agreement]
        return (
          (dcAgreeTypeNames.agreementDocs.includes(agreementValue) ||
            dcAgreeTypeNames.agreementConfirmed.includes(agreementValue)) &&
          this.agreementTypes.some((agreementType) => dataItem[agreementType])
        )
      })
    }
    if (this.approvedDocumentsFilter.length) {
      partOfData = partOfData.filter((dataItem) => {
        const approvedValue = dataItem[this.columns.approved]
        const hasPlus = this.approvedDocumentsFilter.includes('+')
        const hasMinus = this.approvedDocumentsFilter.includes('-')

        if (hasPlus && !hasMinus) {
          return approvedValue !== null
        }
        if (!hasPlus && hasMinus) {
          return approvedValue === null
        }
        return true
      })
    }
    if (this.paymentSumFilter) {
      partOfData = partOfData.filter((row) => {
        return roundNumber(row[this.columns.sumToPay], 2) <= roundNumber(row[this.columns.payedSumFact] || 0, 2)
      })
    }

    if (this.limitDateFilter) {
      partOfData = partOfData.filter((row) => {
        const limitDate = dateFromString(row[this.columns.limitDate] || '')
        const lastPaymentDate = dateFromString(row[this.columns.lastPaymentDate] || '')
        return limitDate && lastPaymentDate && lastPaymentDate <= limitDate
      })
    }

    this.filteredData = UtilFunctions.filterData(partOfData, this.textFilters)
    this.changePage()
  }

  changePage() {
    this.shownDataLength = this.filteredData.length

    if (this.page > this.maxPage) this.page = this.maxPage
    if (this.page < 1) this.page = 1

    this.shownData$.next(this.filteredData.slice(this.rowsPerPage * (this.page - 1), this.rowsPerPage * this.page))
    this.loading$.next(false)
  }
}
