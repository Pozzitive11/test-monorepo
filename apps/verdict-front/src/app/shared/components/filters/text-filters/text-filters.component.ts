import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InputInGroupComponent } from '../../input-in-group/input-in-group.component'
import { TextFilterModel } from '../models/text-filter-model'
import { SwitchCheckboxComponent } from '../../switch-checkbox/switch-checkbox.component'
import { textFilterTypes } from '../models/filter-types.constant'

@Component({
  selector: 'app-text-filters',
  standalone: true,
  imports: [CommonModule, InputInGroupComponent, SwitchCheckboxComponent],
  templateUrl: './text-filters.component.html'
})
export class TextFiltersComponent {
  readonly filterTypes = textFilterTypes

  @Input() filter: TextFilterModel = { not: false }
  @Input() title = 'Текстові фільтри'
  @Output() filterChange = new EventEmitter<TextFilterModel>()
  @Output() applied = new EventEmitter<void>()

  selectFilter() {
    this.filterChange.emit({ ...this.filter })
  }

  applyFilters() {
    this.applied.emit()
  }
}
