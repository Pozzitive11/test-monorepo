import { inject, Injectable, signal } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'
import { PpHttpClientService } from './pp-http-client.service'
import {
  DataChange,
  GlobalFilters,
  ProcessInfoModel,
  ServerDataModel,
  ServerDropdownDependedModel,
  ServerDropdownModel,
  UpdateInfo
} from '../../../data-models/server-data.model'
import { HttpErrorResponse } from '@angular/common/http'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { ProcessTypes } from '../models/process-types'
import { dateReviverUtil } from '../../../shared/utils/date-reviver.util'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { PaymentIdUpdateInfoModel } from '../models/payment-id-update-info.model'


@Injectable({
  providedIn: 'root'
})
export class PpTableDataService {
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)

  private data: { [key: string]: any }[] = []
  private dropdowns: ServerDropdownModel[] = []
  private dropdowns_depended: ServerDropdownDependedModel[] = []
  private dataChanges: DataChange[] = []

  editableCols: string[] = []
  colsType: { [key: string]: string } = {}

  wasChanged: boolean = false
  processType: string = ProcessTypes.NKS
  insertedContracts = signal<number[]>([])

  rowIdsInUpdate: { col: string, id: string }[] = []

  dataIsLoading$ = new BehaviorSubject<boolean>(false)
  dataIsReady$ = new Subject<void>()

  dropdownDependedMenuChanged$ = new BehaviorSubject<{ id: string, col: string }>({ id: '', col: '' })
  dataUpdate$ = new Subject<UpdateInfo>()
  dataChanged$ = new Subject<boolean>()

  get payIdCol() {
    return this.processType === ProcessTypes.NKS ? 'id платежу з НКС' : 'id платежу з К1'
  }

  loadingDataObserver$ = {
    next: (server_data: ServerDataModel) => {
      if (server_data.hasOwnProperty('data'))
        this.data = JSON.parse(JSON.stringify(server_data['data']), dateReviverUtil)
      if (server_data.hasOwnProperty('editable_cols'))
        this.editableCols = server_data['editable_cols']
      if (server_data.hasOwnProperty('cols_type'))
        this.colsType = server_data['cols_type']
      if (server_data.hasOwnProperty('dropdowns'))
        this.dropdowns = server_data['dropdowns']
      if (server_data.hasOwnProperty('dropdowns_depended'))
        this.dropdowns_depended = server_data['dropdowns_depended']
    },
    error: (error: HttpErrorResponse) => {
      this.dataIsLoading$.next(false)
      this.messageService.sendError(error.error.detail)
    },
    complete: () => {
      if (this.data.length > 0)
        this.dataIsReady$.next()
      this.dataIsLoading$.next(false)
    }
  }


  // =================================================================== CELL FUNCTIONS ================================

  getFieldType(col: string) {
    if (this.colsType.hasOwnProperty(col)) {
      return this.colsType[col]
    }
    return 'default'
  }

  getRow(rowId: string) {
    return this.data.find(row => row['id'] === rowId)
  }

  // =================================================================== DATA FUNCTIONS ================================

  // вызывается только при нажатии на кнопку "Загрузить данные" или "Скасувати зміни"
  // также вызывается после разбивки платежа
  uploadData(files: string[], min_date: string, max_date: string, bufferType: string) {
    this.wasChanged = false
    this.dataIsLoading$.next(true)

    this.httpService.getPurposeData(files, min_date, max_date, bufferType, this.processType)
      .subscribe(this.loadingDataObserver$)
  }

  uploadDataFromIds(selectedIds: string[]) {
    this.wasChanged = false
    this.dataIsLoading$.next(true)

    this.httpService.getPurposeDataFromIds(selectedIds, this.processType)
      .subscribe(this.loadingDataObserver$)
  }

  getData(): { [key: string]: any }[] {
    return this.data.slice()
  }

  getAllIds(): string[] {
    return this.data.map(value => value['id'])
  }

  findIndexOfData(id: string) {
    return this.data.findIndex(
      (row) => row['id'] === id
    )
  }

  processSplitting(data: ProcessInfoModel) {
    this.dataIsLoading$.next(true)

    for (let info of data.info)
      this.messageService.sendInfo(info)
    for (let error of data.errors)
      this.messageService.sendError(error)

    this.dataIsLoading$.next(false)
  }

  // ============================================================== ONE VALUE FUNCTIONS ================================

  changeValue(oldValue: any, value: any, rowId: string, colName: string, selectedIds: string[]) {
    this.dataIsLoading$.next(true)
    this.wasChanged = true
    if (!selectedIds.includes(rowId))
      selectedIds = [rowId]

    this.rowIdsInUpdate.push(...selectedIds.map(id => ({ col: colName, id: id })))

    selectedIds.forEach(
      id => {
        const index = this.findIndexOfData(id)

        // если колонка Final НКС - запрашиваем инфу по этому НКС
        if (colName === 'Final НКС') {
          this.requestContractInfo(
            <string>value,
            [id],
            this.data[index]['Подтип платежа'],
            this.data[index]['Наименование контр.'],
            colName
          )
        }

        // изменяем credit_id
        else if (colName === 'credit_id') {
          this.updateC1CreditId(value, [id])
        }

        // изменяем id платежа
        else if (colName === this.payIdCol) {
          this.updatePaymentId(id, value || null, this.data[index])
        }

        // изменяем контрагента и договор если изменился подтип платежа
        else if (colName === 'Подтип платежа') {
          const updateSellerInfo = (
            value === 'Возврат авансовых' && this.data[index][colName] !== 'Возврат авансовых' ||
            value !== 'Возврат авансовых' && this.data[index][colName] === 'Возврат авансовых'
          )
          if (updateSellerInfo) {
            const contractCol = 'Final НКС'
            const contractId = this.data[index][contractCol]
            this.requestContractInfo(
              <string>contractId,
              [id],
              value,
              this.data[index]['Наименование контр.'],
              colName
            )
            this.updateValue([id], value, colName, true)
          } else
            this.updateValue([id], value, colName, true)
        }

        // изменяем переменную с данными для таблицы
        else
          this.updateValue([id], value, colName, true)

      }
    )
  }

  updateValue(selectedIds: string[], value: any, colName: string, saveChange: boolean) {
    for (const id of selectedIds) {
      const index = this.findIndexOfData(id)
      this.data[index][colName] = value
    }

    if (saveChange)
      this.addNewChange(selectedIds, colName, value)

    selectedIds.forEach(rowId => this.dropdownDependedMenuChanged$.next({ id: rowId, col: colName }))

    this.removeFromRowIdsInUpdate(selectedIds, colName)
  }

  updateC1CreditId(value: string | number, selectedIds: string[]) {
    this.httpService.creditC1Exists(value)
      .subscribe({
        next: (isExists) => {
          if (isExists) {
            this.dataChanged$.next(true)
            this.updateValue(selectedIds, value, 'credit_id', true)
          } else {
            this.messageService.sendError(`Кредиту з заданим id не існує: ${value}`)
            this.removeFromRowIdsInUpdate(selectedIds, 'credit_id')
          }
        },
        error: (error) => this.messageService.sendError(error.error.detail)
      })
  }

  // =============================================================== DROPDOWN FUNCTIONS ================================

  getDropdown(col: string): string[] {
    let currentDropdown: ServerDropdownModel[] = this.dropdowns.filter((obj) => obj.column === col)
    if (currentDropdown.length > 0)
      return currentDropdown[0].values

    return []
  }

  getDropdownDepended(colDependency: string, col: string, id: string): string[] {
    const value_dependencies = this.data.filter((row) => row['id'] === id)
    if (value_dependencies.length === 0)
      return []

    const value_dependency = value_dependencies[0][colDependency]

    const dropdowns = this.dropdowns_depended.filter(
      (dropdown) => dropdown.column === col && dropdown.value_dependency === value_dependency
    )
    if (dropdowns.length === 0)
      return []

    return dropdowns[0].values
  }

  getDropdownDependency(col: string) {
    return this.dropdowns_depended
      .filter((dropdown) => dropdown.column === col)[0].column_dependency
  }

  // ================================================================= SERVER FUNCTIONS ================================

  requestContractInfo(
    contractId: string,
    selectedIds: string[],
    paymentUnderType: any,
    contrAgent: any,
    colName: string
  ) {
    const updateSellerInfo = paymentUnderType !== 'Возврат авансовых'
    this.httpService.getContractInfo(contractId, updateSellerInfo)
      .subscribe({
        next: (info) => {
          info.ids = selectedIds
          if (!updateSellerInfo)
            info.changes.push(
              { col: 'Контрагент', value: contrAgent, saveChange: false },
              { col: 'Договір', value: '', saveChange: false },
              { col: 'DFid', value: null, saveChange: true }
            )
          this.dataUpdate$.next(info)
          info.changes
            .forEach(change => {
                if (change.saveChange)
                  this.addNewChange(info.ids, change.col, change.value)
              }
            )
        },
        error: (err) => {
          this.messageService.sendError(err.error.detail)
          this.removeFromRowIdsInUpdate(selectedIds, colName)
        },
        complete: () => this.updateValue(
          selectedIds,
          colName === 'Final НКС' ? contractId : paymentUnderType,
          colName,
          true
        )
      })

  }

  updatePaymentId(id: string, payId: number | null, row: { [p: string]: any }) {
    const colName = this.payIdCol
    this.httpService.updatePaymentId(payId, row, this.processType)
      .subscribe({
        next: valid => {
          if (!valid) {
            this.messageService.sendError(`Платіж з id "${payId}" не збігається з даними виписки.`)
            this.removeFromRowIdsInUpdate([id], colName)
          } else
            this.updateValue([id], payId, colName, true)
        },
        error: (err) => {
          this.messageService.sendError(err.error.detail)
          this.removeFromRowIdsInUpdate([id], colName)
        }
      })
  }

  addNewChange(selectedIds: string[], colName: string, value: any) {
    this.dataChanges.push({
      id: selectedIds,
      col: colName,
      new_value: value || null
    })
  }

  saveChanges() {
    // console.log(this.dataChanges)
    this.dataIsLoading$.next(true)
    this.httpService.saveChanges(this.dataChanges, this.processType)
      .subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: (error) => {
          this.messageService.sendError(error.error.detail)
          this.dataIsLoading$.next(false)
        },
        complete: () => {
          this.resetChanges(false)
          this.dataIsLoading$.next(false)
        }
      })
  }

  resetChanges(resetData: boolean = true) {
    this.wasChanged = false
    this.dataChanges = []
    if (resetData)
      this.data = []
  }

  prepareUpload(files: string[], minDate: string, maxDate: string, bufferType: string) {
    const glFilters: GlobalFilters = {
      files: files,
      min_date: minDate,
      max_date: maxDate,
      bufferType: bufferType
    }
    return this.httpService.prepareUpload(glFilters, this.processType)
  }

  prepareUploadFull() {
    return this.httpService.prepareUpload(null, this.processType)
  }

  getFileWithSelectedIds(selectedIds: string[]) {
    this.dataIsLoading$.next(true)
    this.httpService.getFileWithSelectedIds(selectedIds, this.processType).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, `Buffer_`),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.dataIsLoading$.next(false)
      },
      complete: () => this.dataIsLoading$.next(false)
    })
  }

  updatePaymentIds(formData: FormData) {
    this.dataIsLoading$.next(true)
    this.httpService.updatePaymentIds(formData, this.processType).subscribe({
      next: (updateInfo) => this.updatePaymentIdInTable(updateInfo),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.dataIsLoading$.next(false)
      },
      complete: () => this.dataIsLoading$.next(false)
    })
  }

  autoUpdatePaymentIds(selectedIds: string[] | null) {
    this.dataIsLoading$.next(true)
    this.httpService.autoUpdatePaymentIds(selectedIds, this.processType).subscribe({
      next: (updateInfo) => this.updatePaymentIdInTable(updateInfo),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.dataIsLoading$.next(false)
      },
      complete: () => this.dataIsLoading$.next(false)
    })
  }

  private updatePaymentIdInTable(updateInfo: PaymentIdUpdateInfoModel) {
    const allIds = this.data.map(row => row['id'])

    updateInfo.ProcessInfo.errors.forEach(err => this.messageService.sendError(err))
    updateInfo.ProcessInfo.info.forEach(info => this.messageService.sendInfo(info))
    updateInfo.PaymentChecks.forEach(check => {
      if (allIds.includes(check.PaymentProcessingId)) {
        const index = this.findIndexOfData(check.PaymentProcessingId)
        this.data[index][this.payIdCol] = check.PaymentId
      }
    })
    this.dataIsReady$.next()
  }

  private removeFromRowIdsInUpdate(ids: string[], colName: string) {
    this.rowIdsInUpdate = this.rowIdsInUpdate.filter(id => !(ids.includes(id.id) && id.col === colName))
    if (!this.rowIdsInUpdate.length)
      this.dataIsLoading$.next(false)
  }
}
