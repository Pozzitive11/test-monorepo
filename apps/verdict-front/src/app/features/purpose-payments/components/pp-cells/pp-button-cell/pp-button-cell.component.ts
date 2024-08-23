import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
  selector: 'pp-button-cell',
  templateUrl: './pp-button-cell.component.html',
  standalone: true,
  imports: [NgIf]
})
export class PpButtonCellComponent {
  @Input() row: string = '_'
  @Input() col: string = ''
  @Input() value: any = undefined

  @Output() valueChange = new EventEmitter<boolean>()

  changeValue(newValue: boolean) {
    this.value = newValue
    this.valueChange.emit(newValue)
  }
}
