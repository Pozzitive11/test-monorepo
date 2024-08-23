import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MultipleInputComponent } from '../../../../../shared/components/multiple-input/multiple-input.component'

@Component({
  selector: 'pp-list-cell',
  templateUrl: './pp-list-cell.component.html',
  standalone: true,
  imports: [MultipleInputComponent]
})
export class PpListCellComponent {
  readonly pattern: RegExp = /\d*/g

  @Input() value: string[] = []

  @Output() valueChange = new EventEmitter<string[]>()

  changeValue(newValues: string[]) {
    this.value = newValues
    this.valueChange.emit(this.value)
  }
}
