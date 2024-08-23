import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap'
import { UserSearchModel } from '../../../../shared/models/user-search.model'
import { DateAdapterForNgbService } from '../../../../shared/services/date-adapter-for-ngb.service'
import { DateFormatterForNgbService } from '../../../../shared/services/date-formatter-for-ngb.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { DcAdditionalDocsFields } from '../../models/dc-additional-docs-fields'
import { dctTypesFullEnum, isDctTypesFullKeys } from '../../models/dc-template-models/dct-types.enum'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { DcAdditionalDocsFieldsComponent } from '../dc-additional-docs-fields/dc-additional-docs-fields.component'
import { UserSearchComponent } from '../../../../shared/components/user-search/user-search.component'
import { DcPathsOfDocSendingComponent } from '../dc-paths-of-doc-sending/dc-paths-of-doc-sending.component'
import { FormsModule } from '@angular/forms'
import { DecimalPipe, NgIf } from '@angular/common'


@Component({
  selector: 'dc-promotion-row-edit',
  templateUrl: './dc-promotion-row-edit.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: DateAdapterForNgbService },
    { provide: NgbDateParserFormatter, useClass: DateFormatterForNgbService }
  ],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgbInputDatepicker,
    DcPathsOfDocSendingComponent,
    UserSearchComponent,
    DcAdditionalDocsFieldsComponent,
    SwitchCheckboxComponent,
    DecimalPipe
  ]
})
export class DcPromotionRowEditComponent {
  private readonly promotionsData = inject(DcPromotionsDataService)
  readonly activeModal = inject(NgbActiveModal)

  @Input() row!: { [key: string]: any }
  @Input() writeOff!: string
  @Input() sumToPay!: string
  @Input() pathsOfSending!: { name: string, selected: boolean }[]

  maxMonths: number = 60

  get operators(): UserSearchModel[] { return this.promotionsData.operators }

  updateSumToPay() {
    this.row['Сума до сплати'] = this.row['Сума боргу на момент подачі'] - UtilFunctions.nfs(this.writeOff)
    if (this.row['Кількість місяців по РС'])
      this.row['Сума оплат/місяць'] = this.row['Сума до сплати'] / this.row['Кількість місяців по РС']
  }

  changeSumToPay() {
    this.row['Сума до сплати'] = UtilFunctions.nfs(this.sumToPay)
    this.writeOff = UtilFunctions.formatNumber(this.row['Сума боргу на момент подачі'] - this.row['Сума до сплати'])
    this.row['% списання'] = UtilFunctions.nfs(this.writeOff) / this.row['Сума боргу на момент подачі'] * 100
    if (this.row['Кількість місяців по РС'])
      this.row['Сума оплат/місяць'] = this.row['Сума до сплати'] / this.row['Кількість місяців по РС']
  }

  changeWriteOffPercent() {
    this.writeOff = UtilFunctions.formatNumber('' + (this.row['% списання'] * this.row['Сума боргу на момент подачі'] / 100))
    this.updateSumToPay()
  }

  changeRSMonths() {
    if (this.row['Кількість місяців по РС'] === this.maxMonths)
      this.maxMonths++
    this.row['Сума оплат/місяць'] = this.row['Сума до сплати'] / this.row['Кількість місяців по РС']
    this.row['Гранична дата по узгодженню'] = this.calculateRSFinalDate(this.row['Кількість місяців по РС'])
  }

  calculateRSFinalDate(rsMonths: number): string {
    const now = new Date()
    let limit_year = Math.trunc(rsMonths / 12) + now.getFullYear()
    let limit_month = rsMonths % 12 + now.getMonth()
    if (now.getDate() > 20)
      limit_month++
    if (limit_month > 12) {
      limit_year++
      limit_month -= 12
    }

    if (now.getDate() > 20)
      return UtilFunctions.formatDate(new Date(limit_year, limit_month, 15))

    let limit_date = new Date(limit_year, limit_month, 1)
    limit_date.setTime(limit_date.getTime() - 24 * 60 * 60 * 60)

    return UtilFunctions.formatDate(limit_date)
  }

  save() {
    const index = this.promotionsData.tableData.findIndex((value) => value['id'] === this.row['id'])
    this.promotionsData.saveRowChange(this.row, index)
  }

  changePaths(newPaths: string) {
    this.row['Шляхи відправки'] = newPaths
  }

  changeAdditionalDocsFields(newFields: DcAdditionalDocsFields) {
    Object.keys(newFields).forEach(key => {
      if (!isDctTypesFullKeys(key))
        return

      this.row[dctTypesFullEnum[key]] = newFields[key]
    })
  }

  loadOperators() {
    this.promotionsData.loadOperators()
  }

  changeTS(selectedUser: UserSearchModel) {
    this.row['operator'] = selectedUser
  }

  getOperatorModel() {
    const operator = this.operators.filter(user => user.Login === this.row['ТС'])
    if (operator.length)
      return operator[0]

    return undefined
  }

  showPromotions(row: { [p: string]: any }) {
    return !['погоджений', 'тільки документи'].includes(row['Наявність узгодження'])
  }
}
