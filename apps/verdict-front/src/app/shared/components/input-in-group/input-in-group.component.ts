import { Component, input, model, OnChanges, output, signal, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'


@Component({
  selector: 'app-input-in-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-in-group.component.html'
})
export class InputInGroupComponent implements OnChanges {
  value = model.required<string>()
  typeOfInput = input<'text' | 'number'>('text')
  showInput = input<boolean>(true)
  fillColor = input<string>('#f0ff9f')
  placeholder = input<string>('...')
  clearOnDblClick = input<boolean>(true)
  disabled = input<boolean>(false)
  inputClass = input<string>('text-12 mb-2')

  valueChange = output<string>()
  valueChangedNumber = output<number | undefined>()
  enterPressed = output()

  readonly lastValue = signal('')

  emptyValue() {
    this.value.set('')
    this.selectValue(this.value())
  }

  selectValue(value: string) {
    if (this.typeOfInput() === 'number')
      this.valueChangedNumber.emit(value === '' ? undefined : Number(value))
    else
      this.valueChange.emit(value)
    this.lastValue.set(value)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].currentValue !== this.lastValue())
      this.lastValue.set(changes['value'].currentValue)
  }
}
