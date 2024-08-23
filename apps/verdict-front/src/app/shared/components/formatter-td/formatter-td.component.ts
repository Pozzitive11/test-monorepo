import { Component, HostBinding, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: '[formatted-td]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formatter-td.component.html'
})
export class FormatterTdComponent {
  @Input() value: any
  @Input() isPercent: boolean = false
  @Input() isStrong: boolean = false
  @Input() currency?: string
  @Input() additionalClasses: string[] = []

  @HostBinding('class') get class() {
    return this.additionalClasses.concat(
      this.isNumber || this.isDate ? ['text-end'] : []
    ).join(' ')
  }

  get isNumber() { return typeof this.value === 'number' }

  get isString() { return typeof this.value === 'string' }

  get isDate() { return this.value instanceof Date }

  get isBoolean() { return typeof this.value === 'boolean' }

  get isNull() { return this.value === null }

  get isUndefined() { return this.value === undefined }

  get isObject() { return typeof this.value === 'object' }

  get isInteger() { return Number.isInteger(this.value) }

}
