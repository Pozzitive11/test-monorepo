import { CommonModule } from '@angular/common'
import { Component, input, model, OnInit, output, signal } from '@angular/core'
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { ShortTextPipe } from '../../pipes/short-text.pipe'
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning'

@Component({
  selector: 'app-default-dropdown',
  templateUrl: './default-dropdown.component.html',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgbTooltipModule, ShortTextPipe]
})
export class DefaultDropdownComponent<T extends string> implements OnInit {
  selectedValue = model<T>()

  btnClass = input<string>('btn btn-outline-primary')
  placement = input<PlacementArray>('bottom-start')
  valueList = input<T[]>([])

  boldValuesNum = input<number>(0)
  cycled = input<boolean>(false)
  selectable = input<boolean>(true)
  scrollable = input<boolean>(false)
  showTooltip = input<boolean>(true)
  showButtonTooltip = input<boolean>(false)
  customTooltip = input<string>()
  disabled = input<boolean>(false)
  fontSize = input<number>(12)

  valueSelected = output<T>()

  textPlacement = signal<'left' | 'right'>('left')

  ngOnInit(): void {
    if (this.placement().includes('end'))
      this.textPlacement.set('right')
  }

  selectValue(value: T) {
    if (this.selectable())
      this.selectedValue.set(value)
    this.valueSelected.emit(value)
  }

  cycleValue() {
    if (this.cycled() && this.selectedValue() && this.valueList().includes(this.selectedValue()!)) {
      const nextIndex = (this.valueList().findIndex(value => this.selectedValue() === value) + 1) % this.valueList().length

      this.selectValue(this.valueList()[nextIndex])
    }
  }
}
