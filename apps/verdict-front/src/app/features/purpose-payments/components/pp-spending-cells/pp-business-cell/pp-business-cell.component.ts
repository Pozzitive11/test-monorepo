import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { DictionaryFullModel } from '../../../../../shared/models/dictionary-full.model'
import { PpSpendingCellsService } from '../../../services/pp-spending-cells.service'
import { map } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'pp-business-cell',
  templateUrl: './pp-business-cell.component.html',
  standalone: true,
  imports: [DefaultDropdownComponent, AsyncPipe]
})
export class PpBusinessCellComponent implements OnInit {
  readonly spendingCellsService = inject(PpSpendingCellsService)

  @Input() row: string = '_'
  @Input() value?: DictionaryFullModel

  @Output() valueChange = new EventEmitter<DictionaryFullModel>()

  businessList$ = this.spendingCellsService.businesses$.pipe(
    map(businesses => businesses.map(business => business.Name))
  )

  changeValue(businessName?: string) {
    if (this.value === businessName) return

    this.value = this.spendingCellsService.businesses$.value.find(business => business.Name === businessName)
    this.spendingCellsService.businessSelected$.next({ row: this.row, value: this.value })
    this.valueChange.emit(this.value)
  }

  ngOnInit(): void {
    if (this.value) {
      this.spendingCellsService.businessSelected$.next({ row: this.row, value: this.value })
    }
  }
}
