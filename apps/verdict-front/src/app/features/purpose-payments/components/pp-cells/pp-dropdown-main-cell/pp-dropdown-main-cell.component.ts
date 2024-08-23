import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { PpTableDataService } from '../../../services/pp-table-data.service'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'pp-dropdown-main-cell',
  templateUrl: './pp-dropdown-main-cell.component.html',
  standalone: true,
  imports: [DefaultDropdownComponent]
})
export class PpDropdownMainCellComponent implements OnInit {
  private readonly dataService = inject(PpTableDataService)

  @Input() row: string = '_'
  @Input() col: string = ''
  @Input() value: string = ''
  @Input() dropdownMenu: string[] = []

  @Output() valueChange = new EventEmitter<string>()

  oldValue: string = ''

  setDropdownValue(newValue: string) {
    this.oldValue = this.value

    if (newValue === this.value)
      return

    this.value = newValue
    this.valueChange.emit(this.value)
  }

  ngOnInit(): void {
    this.dataService.dropdownDependedMenuChanged$.next({ id: this.row, col: this.col })
  }
}
