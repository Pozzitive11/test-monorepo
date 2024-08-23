import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { filter, map, tap } from 'rxjs'
import { PpTableDataService } from '../../../services/pp-table-data.service'
import { AsyncPipe } from '@angular/common'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'pp-dropdown-depended-cell',
  templateUrl: './pp-dropdown-depended-cell.component.html',
  standalone: true,
  imports: [DefaultDropdownComponent, AsyncPipe]
})
export class PpDropdownDependedCellComponent {
  private readonly dataService = inject(PpTableDataService)

  @Input() row: string = '_'
  @Input() col: string = ''
  @Input() value: string = ''
  @Input() dropdownColDependency: string = ''

  @Output() valueChange = new EventEmitter<string>()

  dropdownMenu$ = this.dataService.dropdownDependedMenuChanged$
    .pipe(
      filter((obj) => obj.id === this.row && obj.col === this.dropdownColDependency),
      map((_) => this.dataService.getDropdownDepended(this.dropdownColDependency, this.col, this.row)),
      tap((dropdownMenu) => {
        if (!dropdownMenu.includes(this.value))
          this.value = ''
      })
    )

  oldValue: string = ''

  setDropdownValue(newValue: string) {
    this.oldValue = this.value

    if (newValue === this.value)
      return

    this.value = newValue
    this.valueChange.emit(this.value)
  }
}
