import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { NgbActiveModal, NgbDate, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DctRefNumberModel } from '../../../models/dc-template-models/dct-ref-number.model'
import { DcPromotionSimpleModel } from '../../../models/dc-promotion-simple.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import { SearchableListComponent } from '../../../../../shared/components/searchable-list/searchable-list.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { InputInGroupComponent } from '../../../../../shared/components/input-in-group/input-in-group.component'

@Component({
  selector: 'dct-add-manual-ref-modal',
  templateUrl: './dct-add-manual-ref-modal.component.html',
  styles: [
    'table td { background-color: transparent !important }'
  ],
  standalone: true,
  imports: [
    InputInGroupComponent,
    NgIf,
    NgbProgressbar,
    NgFor,
    SearchableListComponent,
    DefaultDropdownComponent,
    DatePickerPopupComponent,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class DctAddManualRefModalComponent {
  readonly activeModal = inject(NgbActiveModal)

  readonly docTypes = [
    'Довідка про закриття',
    'Гарантійний лист',
    'Інформаційний лист',
    'Витяг'
  ]
  readonly minDate: NgbDate | null
  readonly maxDate: NgbDate | null = UtilFunctions.createNgbDateFromDate(new Date())

  @Input() loading: boolean = false
  @Input() refNumberCompanies: string[] = []
  @Input() manualRefNumber: DctRefNumberModel = {
    ClientPromotionId: null,
    Company: '',
    ContractId: 0,
    DocType: '',
    Executant: 'А.Єрошенко',
    RefNumber: '',
    RefNumberDate: new Date(),
    id: null
  }
  @Input() contractPromotions: DcPromotionSimpleModel[] = []

  @Output() contractIdChange = new EventEmitter<number | null>()

  get refNumberDate() {
    return UtilFunctions.createNgbDateFromDate(this.manualRefNumber.RefNumberDate)
  }

  set refNumberDate(value) {
    this.manualRefNumber.RefNumberDate = UtilFunctions.ngbDateToDate(value) || new Date()
  }

  constructor() {
    const minDate = new Date()
    minDate.setDate(minDate.getDate() - 14)
    this.minDate = UtilFunctions.createNgbDateFromDate(minDate)
  }

  changeContract(contractId: number | undefined) {
    this.manualRefNumber.ContractId = contractId || 0
    this.contractIdChange.emit(contractId || null)
  }

  canBeSaved() {
    return !!(
      this.manualRefNumber.ContractId &&
      this.manualRefNumber.DocType &&
      this.manualRefNumber.RefNumber &&
      this.manualRefNumber.Company &&
      this.manualRefNumber.Executant
    )
  }
}
