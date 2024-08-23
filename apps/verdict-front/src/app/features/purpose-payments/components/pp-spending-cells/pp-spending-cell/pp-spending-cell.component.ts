import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { PpSpendingCellsService } from '../../../services/pp-spending-cells.service'
import { DictionaryFullModel } from '../../../../../shared/models/dictionary-full.model'
import { combineLatest, filter, map, Observable, tap } from 'rxjs'
import { ShortTextPipe } from '../../../../../shared/pipes/short-text.pipe'
import { AsyncPipe, NgFor } from '@angular/common'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'pp-spending-cell',
  templateUrl: './pp-spending-cell.component.html',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbTooltip,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    AsyncPipe,
    ShortTextPipe
  ]
})
export class PpSpendingCellComponent {
  readonly spendingCellsService = inject(PpSpendingCellsService)

  @Input() row: string = '_'
  @Input() value?: DictionaryFullModel

  @Output() valueChange = new EventEmitter<DictionaryFullModel>()

  spendingTypesList$: Observable<DictionaryFullModel[]> = combineLatest([
    this.spendingCellsService.spendingParentTypeSelected$,
    this.spendingCellsService.spendingTypes$
  ]).pipe(
    filter(([spendingParentTypeSelected, _]) => spendingParentTypeSelected.row === this.row),
    map(([spendingParentTypeSelected, spendingTypes]) => {
      return spendingTypes.filter(type => type.Description === spendingParentTypeSelected.value?.id.toString())
    }),
    tap(spendingTypes => {
      if (spendingTypes.map(spendingType => spendingType.Name).indexOf(<string>this.value?.Name) === -1)
        this.changeValue(spendingTypes.length === 1 ? spendingTypes[0] : undefined)
    })
  )

  changeValue(spendingType?: DictionaryFullModel) {
    if (this.value === spendingType) return

    this.value = spendingType
    this.valueChange.emit(this.value)
  }

}
