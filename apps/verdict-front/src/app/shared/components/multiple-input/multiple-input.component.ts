import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-multiple-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiple-input.component.html',
  styleUrls: ['./multiple-input.component.css']
})
export class MultipleInputComponent implements OnChanges {
  @Input() values: string[] = ['']
  @Input() placeholder: string = 'Введіть значення'
  @Input() pattern: string | RegExp = /.*/g

  valueInEdit: string = ''

  @Output() valuesChange = new EventEmitter<string[]>()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['values'].currentValue.length === 0)
      this.values = ['']
  }

  afterValueChanged() {
    this.valuesChange.emit(this.values.filter((value) => value !== ''))
  }

  clearValue(value: string) {
    // filter out any symbols that are not following this.pattern
    return value.replace(new RegExp(`[^${this.pattern}]`, 'g'), '')
  }
}
