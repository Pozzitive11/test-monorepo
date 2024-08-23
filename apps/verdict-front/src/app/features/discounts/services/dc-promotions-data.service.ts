import { inject, Injectable } from '@angular/core'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { map, of, retry, Subject, take } from 'rxjs'
import { UserSearchModel } from '../../../shared/models/user-search.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { DcAdditionalDocsFields } from '../models/dc-additional-docs-fields'
import { dcAgreeInfoType } from '../models/dc-agree-info.type'
import { DcClientPromotionUpdateModel } from '../models/dc-client-promotion-update-model'
import { dctTypesFullEnum, isDctTypesFullKeys } from '../models/dc-template-models/dct-types.enum'
import { DcHttpService } from './dc-http.service'
import { DcPromotionsFiltersService } from './dc-promotions-filters.service'
import { DcSendingDocsFiltersService } from './dc-sending-docs-filters.service'

@Injectable({
  providedIn: 'root'
})
export class DcPromotionsDataService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly filterService = inject(DcPromotionsFiltersService)
  private readonly sendingDocsFiltersService = inject(DcSendingDocsFiltersService)

  readonly agreeInfoTypes: dcAgreeInfoType[] = [
    'погоджений',
    'відмова',
    'довга',
    'піднімати',
    'не вірно',
    'перевірити доходи',
    'перевірити нерухомість'
  ]
  agreeInfoType: dcAgreeInfoType = 'поданий на погодження'
  readonly savingDataObserver = {
    next: (value: { [p: string]: any }[]) => {
      this.filterService.checkedRows = []
      this.tableData = value
      if (this.tableData.length > 0)
        this.header = Object.keys(this.tableData[0]).filter((val) => !this.filterService.hiddenCols.includes(val))
      this.filterService.textFilters = []
      this.filterData()
    },
    error: (err: { error: { detail: string } }) => {
      this.filterService.loading$.next(false)
      this.messageService.sendError(err.error.detail)
    },
    complete: () => {}
  }

  tableData: { [key: string]: any }[] = []
  header: string[] = []
  operators: UserSearchModel[] = []
  chosenDate: NgbDate | null = null

  stopEdit$ = new Subject<boolean>()

  getDatesRange() {
    this.httpService.getPromotionsDates().subscribe({
      next: (dates) =>
        (this.filterService.datesRange = {
          MinDate: UtilFunctions.createNgbDateFromString(dates.MinDate),
          MaxDate: UtilFunctions.createNgbDateFromString(dates.MaxDate)
        }),
      error: (err) => this.messageService.sendError(err.error.detail)
    })
  }

  uploadData() {
    this.filterService.loading$.next(true)
    const { fromDate, toDate } = this.filterService.dateFilter
    const dateFilter = {
      minDate: fromDate ? UtilFunctions.formatNgbDate(fromDate) : fromDate,
      maxDate: toDate ? UtilFunctions.formatNgbDate(toDate) : toDate
    }

    this.httpService
      .getClientsPromotions(
        this.filterService.onlyNew,
        this.filterService.useNewInfo,
        dateFilter,
        this.filterService.getCalculations
      )
      .subscribe(this.savingDataObserver)
  }

  uploadDataFromContractsList(contractsList: string, selectLatestOnly: boolean) {
    this.filterService.loading$.next(true)
    this.httpService
      .getClientsPromotionsFromContractsList(
        contractsList,
        this.filterService.useNewInfo,
        selectLatestOnly,
        this.filterService.getCalculations
      )
      .subscribe(this.savingDataObserver)
  }

  uploadDataFromIds(ids: number[]) {
    this.filterService.loading$.next(true)
    this.httpService.getClientsPromotionsFromIds(ids).subscribe(this.savingDataObserver)
  }

  uploadDataForTemplates(
    dateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null },
    selectedDocumentTypes: string[]
  ) {
    this.filterService.loading$.next(true)
    const { fromDate, toDate } = dateFilter
    const dateFilterStr = {
      fromDate: fromDate ? UtilFunctions.formatNgbDate(fromDate, '%Y-%m-%d') : fromDate,
      toDate: toDate ? UtilFunctions.formatNgbDate(toDate, '%Y-%m-%d') : toDate
    }
    this.httpService
      .getClientsPromotionsForTemplates(dateFilterStr, selectedDocumentTypes)
      .subscribe(this.savingDataObserver)
  }

  filterData() {
    setTimeout(() => {
      this.filterService.filterData(this.tableData)
    })
  }

  saveRowChange(row: { [p: string]: any }, index: number) {
    const operator: UserSearchModel | undefined = row['operator']
    delete row['operator']
    if (!!operator) row['ТС'] = operator.Login

    const oldRow = { ...this.tableData[index] }
    this.tableData[index] = { ...row }

    const additionalFieldsUpdate = Object.keys(dctTypesFullEnum).reduce((acc, key) => {
      if (!isDctTypesFullKeys(key)) return acc

      const value = row[dctTypesFullEnum[key]]
      const oldValue = oldRow[dctTypesFullEnum[key]]
      if (value !== oldValue) acc[key] = value
      else acc[key] = null
      return acc
    }, {} as DcAdditionalDocsFields)

    const dataUpdate: DcClientPromotionUpdateModel = {
      id: row['id'],
      PaymentDateLimit:
        row['Гранична дата по узгодженню'] !== oldRow['Гранична дата по узгодженню']
          ? row['Гранична дата по узгодженню']
          : undefined,
      DiscountPercent: row['% списання'] !== oldRow['% списання'] ? row['% списання'] : undefined,
      RestructuringMonths:
        row['Кількість місяців по РС'] !== oldRow['Кількість місяців по РС']
          ? row['Кількість місяців по РС']
          : undefined,
      Comment: row['Коментар ТС'] !== oldRow['Коментар ТС'] ? row['Коментар ТС'] : undefined,
      IndividualTerms:
        row['Індивідуальні умови стосовно Угоди'] !== oldRow['Індивідуальні умови стосовно Угоди']
          ? row['Індивідуальні умови стосовно Угоди']
          : undefined,

      ...additionalFieldsUpdate,

      SendingWays: row['Шляхи відправки'] !== oldRow['Шляхи відправки'] ? row['Шляхи відправки'] : undefined,
      PostOfficeAddress:
        row['Адреса Укр або Нової пошти'] !== oldRow['Адреса Укр або Нової пошти']
          ? row['Адреса Укр або Нової пошти']
          : undefined,
      SendingDay: row['Дата відправки'] !== oldRow['Дата відправки'] ? row['Дата відправки'] : undefined,

      UserId: operator?.Login !== row['ТС'] ? operator?.id : undefined,

      ContractOriginal:
        row['Оригінал дод. угоди з підписом боржника'] !== oldRow['Оригінал дод. угоди з підписом боржника']
          ? row['Оригінал дод. угоди з підписом боржника']
          : undefined
    }
    this.filterService.loading$.next(true)
    this.httpService.updateClientPromotion(dataUpdate).subscribe({
      next: (value) => this.messageService.sendInfo(value.description),
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.tableData[index] = { ...oldRow }
        this.cancelRowEdit()
      },
      complete: () => this.cancelRowEdit()
    })
  }

  cancelRowEdit() {
    this.stopEdit$.next(true)
    this.filterService.loading$.next(true)
    this.filterData()
  }

  allSubmittedIds() {
    return this.tableData.filter((value) => value['Наявність узгодження'] == undefined).map((value) => value['id'])
  }

  allNotAgreedIds() {
    return this.tableData
      .filter((value) => value['Наявність узгодження'] != undefined && !value['Причина неподачі'])
      .map((value) => value['id'])
  }

  updateRow() {
    const today = new Date()
    const row = this.tableData.filter((value) => {
      value['Документ Затверджено'] = UtilFunctions.formatDate(today)
    })
    return row
  }

  updateSendingRows(rowIds: number[]): void {
    const today = new Date()

    this.sendingDocsFiltersService.filteredCredits$
      .pipe(
        take(1),
        map((filteredCredits) => {
          const updatedCredits = [...filteredCredits]
          rowIds.forEach((rowId) => {
            const rowIndex = updatedCredits.findIndex((row) => row['id'] === rowId)
            if (rowIndex !== -1) {
              updatedCredits[rowIndex]['Дата експорту документа'] = UtilFunctions.formatDate(today, false, '%d.%m.%Y')
            }
          })

          return updatedCredits
        })
      )
      .subscribe((updatedCredits) => {
        this.sendingDocsFiltersService.filteredCredits$ = of(updatedCredits)
      })
  }

  sendToAgreement(ids: number[]) {
    const submittedIds = this.allSubmittedIds()

    ids = ids.filter((id) => submittedIds.includes(id))

    this.httpService.sendToAgreement(ids, this.filterService.getCalculations).subscribe({
      next: (file) => UtilFunctions.downloadXlsx(file, 'ДС', 'dmY'),
      error: async (error) => {
        this.messageService.sendError(
          'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
        )
        this.filterService.loading$.next(false)
      },
      complete: () => this.uploadData()
    })
  }

  markAgreed(ids: number[]) {
    const notAgreedIds = this.allNotAgreedIds()

    ids = ids.filter((id) => notAgreedIds.includes(id))

    this.httpService.markAgreed(ids, this.filterService.useNewInfo, this.agreeInfoType).subscribe({
      next: (value) => this.messageService.sendInfo(value.description),
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.filterService.loading$.next(false)
      },
      complete: () => this.uploadData()
    })
  }

  makeExcel(ids: number[]) {
    this.httpService
      .makeExcelPromotions(ids, this.filterService.useNewInfo, this.filterService.getCalculations)
      .subscribe({
        next: (file) => UtilFunctions.downloadXlsx(file, 'ДС інфо', 'dmY'),
        error: async (error) => {
          this.messageService.sendError(
            'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
          )
          this.filterService.loading$.next(false)
        },
        complete: () => this.uploadData()
      })
  }

  loadOperators() {
    this.httpService
      .loadOperators()
      .pipe(retry(3))
      .subscribe({
        next: (operators) => (this.operators = operators),
        error: (err) => this.messageService.sendError(err.error.detail)
      })
  }
}
