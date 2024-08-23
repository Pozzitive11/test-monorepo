import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'pp-number-cell',
  templateUrl: './pp-number-cell.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class PpNumberCellComponent {
  @Input() row: string = '_'
  @Input() col: string = ''
  @Input() value: string = ''

  @Output() valueChange = new EventEmitter<string>()

  oldValue: string = ''

  changeValue() {
    if (this.value === this.oldValue)
      return
    this.valueChange.emit(this.value)
  }

  cleanValue(value: string) {
    this.value = value.replace(/\D/g, '')
  }

  cancelChange() {
    this.value = this.oldValue
  }
}
