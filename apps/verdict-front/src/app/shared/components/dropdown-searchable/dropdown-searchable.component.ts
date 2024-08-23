import { ChangeDetectionStrategy, Component, input, model } from '@angular/core'
import { NgForOf, NgStyle } from '@angular/common'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'
import { ShortTextPipe } from '../../pipes/short-text.pipe'
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning'
import { SearchableListComponent } from '../searchable-list/searchable-list.component'

@Component({
  selector: 'app-dropdown-searchable',
  standalone: true,
  imports: [
    NgForOf,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    ShortTextPipe,
    NgbTooltip,
    SearchableListComponent,
    NgStyle
  ],
  templateUrl: './dropdown-searchable.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownSearchableComponent<T extends string> {
  selectedValue = model<T>()

  btnClass = input<string>('btn btn-outline-primary')
  placement = input<PlacementArray>('bottom-start')
  valueList = input<T[]>([])

  showButtonTooltip = input<boolean>(false)
  customTooltip = input<string>()
  disabled = input<boolean>(false)
  fontSize = input<number>(12)
  sortValues = input<boolean>(false)
  width = input<string>('auto')
  maxSymbols = input<number>(60)
  closeOnSelect = input<boolean>(false)
  staticBtnText = input<string>('')

  onSelect(value: T, dropdown: NgbDropdown) {
    if (this.closeOnSelect()) {
      dropdown.close()
    }
    this.selectedValue.set(value)
  }
}
