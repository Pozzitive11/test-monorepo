import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { dcAgreeInfoType } from '../../models/dc-agree-info.type'
import { dcAgreeTypeNames } from '../../models/dc-agree-type.names'
import { dctTypesFullEnum } from '../../models/dc-template-models/dct-types.enum'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { DcPromotionsFiltersService } from '../../services/dc-promotions-filters.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import { DcPromotionRowEditComponent } from '../dc-promotion-row-edit/dc-promotion-row-edit.component'
import { DctGuaranteeLetterDataModel } from '../../models/dc-template-models/dct-guarantee-letter-data.model'
import { DctInformLetterDataModel } from '../../models/dc-template-models/dct-inform-letter-data.model'
import { DctWritingOffDataModel } from '../../models/dc-template-models/dct-writing-off-data.model'
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dc-promotions-table',
  templateUrl: './dc-promotions-table.component.html',
  styleUrls: ['./dc-promotions-table.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DecimalPipe, CurrencyPipe]
})
export class DcPromotionsTableComponent implements OnInit, OnDestroy {
  private readonly modalService = inject(NgbModal)
  readonly dataService = inject(DcPromotionsDataService)
  private readonly filterService = inject(DcPromotionsFiltersService)
  readonly templateService = inject(DcTemplatesService)
  readonly promotionDataService = inject(DcPromotionsDataService)

  readonly numberCols: string[] = [
    'Сума в Угоді',
    'Сума в Угоді (тіло)',
    'Сума в Угоді (відсотки)',
    'Сума в Угоді (комісія)',
    'Сума в Угоді (пеня)',
    'Сума боргу на момент подачі',
    'Сума боргу при покупці',
    'Платив до дисконту (всього)',
    'Платив до дисконту (фактичні)',
    'Платив до дисконту (ГІС)',
    'Платив до дисконту (віртуальні)',
    'Платежі після ДС/РС (всього)',
    'Платежі після ДС/РС (фактичні)',
    'Платежі після ДС/РС (ГІС)',
    'Платежі після ДС/РС (віртуальні)',
    'Сума до сплати',
    'Сума оплат/місяць',
    'Тіло на момент подачі',
    '% списання',
    'Сума ВП',
    'Кількість тіл (до сплати)',
    'Кількість місяців по РС',
    'Кількість днів прострочення',
    'Сума ВП',
    'Сума боргу (реєстр)',
    'Сума в реєстрі (тіло)',
    'Сума в реєстрі (відсотки)',
    'Сума в реєстрі (комісія)',
    'Сума в реєстрі (пеня)',
    'Сума платежів після відступлення',
    'Розрахована сума боргу на момент подачі',
    'Розрахована сума (тіло)',
    'Розрахована сума (відсотки)',
    'Розрахована сума (комісія)',
    'Розрахована сума (пеня)',
    'Розрахована сума (625 ст.)',
    'Сума боргу в 1С',
    'Сума боргу в 1С (тіло)',
    'Сума боргу в 1С (відсотки)',
    'Сума боргу в 1С (комісія)',
    'Сума боргу в 1С (пеня)',
    'Сума боргу в 1С (625 ст.)'
  ]
  readonly booleanCols: string[] = [...Object.values(dctTypesFullEnum), 'Оригінал дод. угоди з підписом боржника']
  readonly midCols: string[] = [
    'Назва проєкту',
    'БАНК',
    'ПІБ',
    'Примітка',
    'Подані суміжні договори',
    'Інші суміжні договори',
    'Додаткові фактори',
    'Шляхи відправки',
    'Коментар ТС',
    'Індивідуальні умови стосовно Угоди',
    'Пункт правила'
  ]
  readonly smMidCols: string[] = [
    'Наявність узгодження',
    'Причина неподачі',
    'Оригінальний номер',
    'Область реєстрації',
    'Тип ВД',
    'Категорія',
    'Адреса відправки'
  ]
  readonly moneyCols: string[] = [
    'Сума в Угоді',
    'Сума в Угоді (тіло)',
    'Сума в Угоді (відсотки)',
    'Сума в Угоді (комісія)',
    'Сума в Угоді (пеня)',
    'Сума боргу на момент подачі',
    'Сума боргу при покупці',
    'Платив до дисконту (всього)',
    'Платив до дисконту (фактичні)',
    'Платив до дисконту (ГІС)',
    'Платив до дисконту (віртуальні)',
    'Платежі після ДС/РС (всього)',
    'Платежі після ДС/РС (фактичні)',
    'Платежі після ДС/РС (ГІС)',
    'Платежі після ДС/РС (віртуальні)',
    'Сума до сплати',
    'Сума оплат/місяць',
    'Тіло на момент подачі',
    'Сума ВП',
    'Сума боргу (реєстр)',
    'Сума в реєстрі (тіло)',
    'Сума в реєстрі (відсотки)',
    'Сума в реєстрі (комісія)',
    'Сума в реєстрі (пеня)',
    'Сума платежів після відступлення',
    'Розрахована сума боргу на момент подачі',
    'Розрахована сума (тіло)',
    'Розрахована сума (відсотки)',
    'Розрахована сума (комісія)',
    'Розрахована сума (пеня)',
    'Розрахована сума (625 ст.)',
    'Сума боргу в 1С',
    'Сума боргу в 1С (тіло)',
    'Сума боргу в 1С (відсотки)',
    'Сума боргу в 1С (комісія)',
    'Сума боргу в 1С (пеня)',
    'Сума боргу в 1С (625 ст.)'
  ]
  templatesData: (DctWritingOffDataModel | DctInformLetterDataModel | DctGuaranteeLetterDataModel)[] = []

  @Input() canBeEdited: boolean = true

  editRow?: { [key: string]: any }
  stopEdit?: Subscription

  get header() {
    return this.dataService.header
  }

  get data$() {
    return this.filterService.shownData$
  }

  ngOnInit(): void {
    this.stopEdit = this.dataService.stopEdit$.subscribe(() => (this.editRow = undefined))
  }

  ngOnDestroy() {
    this.stopEdit?.unsubscribe()
  }

  rowChecked(rowId: number) {
    return this.filterService.checkedRows.includes(rowId)
  }

  choseRow(row: { [p: string]: any }) {
    if (!!this.editRow && row['id'] === this.editRow['id']) {
      this.editRow = undefined
      return
    }

    this.editRow = { ...row }

    const modalRef = this.modalService.open(DcPromotionRowEditComponent, {
      size: 'xl',
      centered: true,
      scrollable: true
    })
    modalRef.componentInstance.row = this.editRow
    modalRef.componentInstance.writeOff = this.fillWriteOff()
    modalRef.componentInstance.sumToPay = this.fillSumToPay()
    modalRef.componentInstance.pathsOfSending = this.fillPathsOfSending()

    modalRef.result.then(
      () => this.dataService.cancelRowEdit(),
      () => this.dataService.cancelRowEdit()
    )
  }

  // MAIN FUNCTIONALITY STUFF
  get allRowsChecked() {
    return this.filterService.shownDataLength === this.filterService.checkedRows.length
  }

  colSize(col: string): string {
    const right = this.numberCols.includes(col) ? ' text-end' : ''
    if (this.midCols.includes(col)) return 'mid-col' + right
    else if (this.smMidCols.includes(col)) return 'small-mid-col' + right
    else return 'small-col' + right
  }

  fillWriteOff(): string {
    if (!!this.editRow)
      return UtilFunctions.formatNumber(
        '' + (this.editRow['Сума боргу на момент подачі'] - this.editRow['Сума до сплати'])
      )
    else return ''
  }

  fillSumToPay(): string {
    if (!!this.editRow) return UtilFunctions.formatNumber(this.editRow['Сума до сплати'])
    else return ''
  }

  fillPathsOfSending(): { name: string; selected: boolean }[] {
    if (!this.editRow) return []

    let pathsOfSending: { name: string; selected: boolean }[] = [
      { name: 'Електронна пошта', selected: false },
      { name: 'Нова пошта', selected: false },
      { name: 'Укрпошта', selected: false }
    ]
    if (!this.editRow['Шляхи відправки']) return pathsOfSending

    const paths: string[] = (<string>this.editRow['Шляхи відправки']).split(', ')
    pathsOfSending.forEach((value) => (value.selected = paths.includes(value.name)))

    return pathsOfSending
  }

  checkRow(rowId?: number) {
    if (rowId == undefined) {
      if (this.filterService.shownDataLength === this.filterService.checkedRows.length)
        this.filterService.checkedRows = []
      else this.filterService.checkedRows = this.filterService.filteredData.map((value) => value['id'])

      return
    }

    if (this.filterService.checkedRows.includes(rowId))
      this.filterService.checkedRows = this.filterService.checkedRows.filter((value) => value !== rowId)
    else this.filterService.checkedRows.push(rowId)
  }

  applyFilter(key: string, value: string) {
    if (!value) {
      this.filterService.textFilters = this.filterService.textFilters.filter((value) => value.col !== key)
      this.filterService.loading$.next(true)
      this.dataService.filterData()
      return
    }

    this.filterService.textFilters.push({ col: key, value: value.toLowerCase() })
    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  inDefaultCols(key: string) {
    return ![...this.numberCols, ...this.booleanCols].includes(key)
  }

  booleanToText(value?: boolean): string {
    if (value == undefined) return ''
    else if (value) return 'так'
    else return 'ні'
  }

  handleClickOnConfirmationCell(event: Event): void {
    event.stopPropagation()
  }

  isNumber(value: any) {
    return typeof value === 'number'
  }

  colorClassForRow(notSubmitted: string | undefined, agreeType: dcAgreeInfoType | undefined, approvedType: string) {
    if (this.filterService.documentsVerification) {
      if (approvedType !== null) return 'docs-approved'
      else return 'docs-not-approved'
    }
    if (!!notSubmitted) return 'not-submitted'
    else {
      if (!agreeType) return 'submitted'
      else if (dcAgreeTypeNames.inAgreement.includes(agreeType)) return 'in-agreement'
      else if (dcAgreeTypeNames.agreementConfirmed.includes(agreeType)) return 'agreement-confirmed'
      else if (dcAgreeTypeNames.agreementLong.includes(agreeType)) return 'agreement-long'
      else if (dcAgreeTypeNames.agreementDocs.includes(agreeType)) return 'agreement-docs'
      else if (dcAgreeTypeNames.agreementDenied.includes(agreeType)) return 'agreement-denied'
      else if (dcAgreeTypeNames.agreementOthers.includes(agreeType)) return 'agreement-rise'
      else return 'agreement'
    }
  }
}
