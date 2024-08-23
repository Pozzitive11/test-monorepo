import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { PpRowMarksService } from '../../services/pp-row-marks.service'
import { filter } from 'rxjs'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { PpFiltersService } from '../../services/pp-filters.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import {
  ConfirmationModalComponent
} from '../../../../shared/components/confirmation-modal/confirmation-modal.component'
import { PpDocsCellComponent } from '../pp-spending-cells/pp-docs-cell/pp-docs-cell.component'
import { PpSpendingCellComponent } from '../pp-spending-cells/pp-spending-cell/pp-spending-cell.component'
import {
  PpSpendingParentCellComponent
} from '../pp-spending-cells/pp-spending-parent-cell/pp-spending-parent-cell.component'
import { PpProjectCellComponent } from '../pp-spending-cells/pp-project-cell/pp-project-cell.component'
import { PpBusinessCellComponent } from '../pp-spending-cells/pp-business-cell/pp-business-cell.component'
import { PpListCellComponent } from '../pp-cells/pp-list-cell/pp-list-cell.component'
import { PpDateCellComponent } from '../pp-cells/pp-date-cell/pp-date-cell.component'
import { PpButtonCellComponent } from '../pp-cells/pp-button-cell/pp-button-cell.component'
import { PpNumberCellComponent } from '../pp-cells/pp-number-cell/pp-number-cell.component'
import {
  PpDropdownDependedCellComponent
} from '../pp-cells/pp-dropdown-depended-cell/pp-dropdown-depended-cell.component'
import { PpDropdownMainCellComponent } from '../pp-cells/pp-dropdown-main-cell/pp-dropdown-main-cell.component'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  standalone: true,
  imports: [
    NgIf,
    PpDropdownMainCellComponent,
    PpDropdownDependedCellComponent,
    PpNumberCellComponent,
    PpButtonCellComponent,
    PpDateCellComponent,
    PpListCellComponent,
    PpBusinessCellComponent,
    PpProjectCellComponent,
    PpSpendingParentCellComponent,
    PpSpendingCellComponent,
    PpDocsCellComponent,
    DecimalPipe
  ]
})
export class CellComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(PpTableDataService)
  private readonly rowMarksService = inject(PpRowMarksService)
  private readonly filtersService = inject(PpFiltersService)
  private readonly modalService = inject(NgbModal)

  private readonly noActionFields = [
    'business',
    'business_project',
    'spending_type_parent',
    'spending_type',
    'documents'
  ]

  @Input() row: string = '_'
  @Input() col: string = ''
  @Input() value: any = undefined
  @Input() isDebit: boolean = false
  @Input() isRent: boolean = false

  valueType: string = 'string'
  oldValue: any

  dataUpdate$ = this.dataService.dataUpdate$
    .pipe(filter((update) => update.ids.includes(this.row)))
    .subscribe((update) => {
      for (const change of update.changes) {
        if (change.col === this.col) {
          this.value = change.value
          this.dataService.updateValue(update.ids, change.value, change.col, false)
        }
      }
    })

  get fieldType(): string {
    return this.dataService.getFieldType(this.col)
  }

  get dropdownMenu(): string[] {
    return this.dataService.getDropdown(this.col)
  }

  get dropdownColDependency(): string {
    return this.dataService.getDropdownDependency(this.col)
  }

  ngOnInit(): void {
    if (this.noActionFields.includes(this.fieldType)) return

    this.valueType =
      typeof this.value !== 'object' || Array.isArray(this.value) ? this.filtersService.dataTypes[this.col] : 'date'
    if (this.valueType === 'date' && this.value) this.value = UtilFunctions.formatDate(this.value)
  }

  ngOnDestroy(): void {
    this.dataUpdate$.unsubscribe()
  }

  async sendDataChange(newValue: any) {
    this.oldValue = this.value
    this.value = newValue

    if (this.col === 'Final НКС') {
      if (this.dataService.insertedContracts().includes(newValue)) {
        try {
          const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true })
          const component = modalRef.componentInstance as ConfirmationModalComponent
          component.confirmButtonType = 'success'
          component.title = 'Договір вже був внесений'
          component.confirmText = 'Ви впевнені, що хочете внести його ще раз?'

          await modalRef.result
        } catch (e) {
          this.value = this.oldValue
          this.oldValue = null
          return
        }
      }
      this.dataService.insertedContracts.update((value) => [...new Set([...value, newValue])])
    }

    this.dataService.changeValue(
      this.oldValue,
      this.value,
      this.row,
      this.col,
      this.rowMarksService.listNoAll(this.filtersService.hideIds)
    )
    this.value = this.oldValue
    this.oldValue = null
  }

  isDisabled(): boolean {
    if (this.col === 'Договір' && !this.isRent) return true
    return false
  }

  isEditable(): boolean {
    return this.dataService.editableCols.includes(this.col)
  }

  isMoney() {
    return this.valueType === 'number' && this.col.toLowerCase().search(/сумм?а/) >= 0
  }
}
