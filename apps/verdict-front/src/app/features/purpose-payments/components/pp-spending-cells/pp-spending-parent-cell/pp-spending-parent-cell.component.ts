import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
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
  selector: 'pp-spending-parent-cell',
  templateUrl: './pp-spending-parent-cell.component.html',
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
export class PpSpendingParentCellComponent implements OnInit {
  readonly spendingCellsService = inject(PpSpendingCellsService)

  @Input() row: string = '_'
  @Input() value?: DictionaryFullModel

  @Output() valueChange = new EventEmitter<DictionaryFullModel>()

  spendingParentTypesList$: Observable<DictionaryFullModel[]> = combineLatest([
    this.spendingCellsService.businessSelected$,
    this.spendingCellsService.spendingTypes$
  ]).pipe(
    filter(([businessSelected, _]) => businessSelected.row === this.row),
    map(([businessSelected, spendingTypes]) => {
      return spendingTypes.filter(type => type.SpecId?.toString() === businessSelected.value?.Description)
    }),
    tap(spendingTypes => {
      if (spendingTypes.map(spendingType => spendingType.Name).indexOf(<string>this.value?.Name) === -1)
        this.changeValue(spendingTypes.length === 1 ? spendingTypes[0] : undefined)
    })
  )

  changeValue(spendingParentType?: DictionaryFullModel) {
    if (this.value === spendingParentType) return

    this.value = spendingParentType
    this.spendingCellsService.spendingParentTypeSelected$.next({ row: this.row, value: spendingParentType })
    this.valueChange.emit(this.value)
  }

  ngOnInit(): void {
    if (this.value) {
      this.spendingCellsService.spendingParentTypeSelected$.next({ row: this.row, value: this.value })
    }
  }

}
