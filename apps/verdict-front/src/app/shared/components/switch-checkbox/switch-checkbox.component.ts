import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { generateRandomString } from '../../utils/transform.utils'

@Component({
  selector: 'app-switch-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './switch-checkbox.component.html',
  styleUrls: ['./switch-checkbox.component.css']
})
export class SwitchCheckboxComponent {
  @Input() id: string = generateRandomString()
  @Input() value: boolean = false
  @Input() bottomMargin: number = 2

  @Output() valueChange = new EventEmitter<boolean>()

  updateValue() {
    this.value = !this.value
    this.valueChange.emit(this.value)
  }
}
