import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InputInGroupComponent } from '../../input-in-group/input-in-group.component'
import { SwitchCheckboxComponent } from '../../switch-checkbox/switch-checkbox.component'
import { numberFilterTypes } from '../models/filter-types.constant'
import { NumberFilterModel } from '../models/number-filter.model'

@Component({
  selector: 'app-number-filters',
  standalone: true,
  imports: [CommonModule, InputInGroupComponent, SwitchCheckboxComponent],
  templateUrl: './number-filters.component.html'
})
export class NumberFiltersComponent {
  readonly filterTypes = numberFilterTypes
  @Input() filter: NumberFilterModel = { not: false }
  @Input() title = 'Числові фільтри'
  @Output() filterChange = new EventEmitter<NumberFilterModel>()
  @Output() applied = new EventEmitter<void>()

  selectFilter() {
    this.filterChange.emit({ ...this.filter })
  }

  applyFilters() {
    this.applied.emit()
  }

}
