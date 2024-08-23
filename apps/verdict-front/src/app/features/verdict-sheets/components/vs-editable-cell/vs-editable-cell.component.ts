import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core'
import { IColumnTypeModel } from '../../models/table-inspector-info.model'
import { TValue } from '../../../../shared/models/basic-types'
import { FormsModule } from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { DatePickerPopupComponent } from '../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import dayjs from 'dayjs'
import { DictionaryModel } from '../../../../shared/models/dictionary.model'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'app-vs-editable-cell',
  standalone: true,
  imports: [
    FormsModule,
    NgTemplateOutlet,
    SwitchCheckboxComponent,
    DatePickerPopupComponent,
    DefaultDropdownComponent
  ],
  templateUrl: './vs-editable-cell.component.html',
  styles: `
    div[contenteditable="true"] {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      padding: 8px;
      cursor: pointer;
      background-color: #feffec;
      overflow: hidden;

      &.number {
        display: flex;
        align-items: center;
      }

      &:hover {
        background-color: #fdffbf;
      }

      &:focus {
        width: auto;
        height: auto;
        min-width: 100%;
        min-height: 100%;
        background-color: #feffec;
        z-index: 999;
        outline: 2px solid #ffde6c;
        border-radius: 5px;
        text-align: start;
        align-items: start;
        cursor: text;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsEditableCellComponent {
  id = input.required<string, TValue>({ transform: (value) => `switch-${value}` })
  value = model.required<TValue>()
  type = input.required<IColumnTypeModel>()
  dictionary = input.required({ transform: (v: DictionaryModel[]) => v.map((d) => d.name) })
  fontSize = input.required<number>()
  user = input<string, TValue>('', { transform: (v) => typeof v !== 'string' ? '' : v })

  readonly minDate = new NgbDate(2000, 1, 1)

  saveValue = output<TValue>()

  oldValue = signal<TValue>(undefined)

  chosenDate = computed(() => {
    const value = this.value()
    if (typeof value !== 'string') return null
    const date = new Date(value)
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  })
  valueAsString = computed(() => {
    const value = this.value()
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'boolean') return value ? 'Так' : 'Ні'
    return ''
  })

  numberTemplate = viewChild<TemplateRef<any>>('numberTemplate')
  textTemplate = viewChild<TemplateRef<any>>('textTemplate')
  dateTemplate = viewChild<TemplateRef<any>>('dateTemplate')
  booleanTemplate = viewChild<TemplateRef<any>>('booleanTemplate')
  dictionaryTemplate = viewChild<TemplateRef<any>>('dictionaryTemplate')

  cellTemplate = computed(() => {
    if (this.dictionary().length) return this.dictionaryTemplate()

    switch (this.type().ts_type) {
      case 'number':
        return this.numberTemplate()
      case 'string':
        return this.textTemplate()
      case 'Date':
        return this.dateTemplate()
      case 'boolean':
        return this.booleanTemplate()
      default:
        return this.textTemplate()
    }
  })

  changeValue() {
    this.saveValue.emit(this.value())
  }

  cancelChange() {
    this.value.set(this.oldValue())
  }

  cleanValue() {
    const value = this.value()
    if (this.type().ts_type !== 'number') return
    if (typeof value === 'number') this.value.set(value)
    else if (typeof value === 'string') {
      const number = parseFloat(value.replace(',', '.'))
      if (!isNaN(number)) this.value.set(number)
      else this.value.set(this.oldValue())
    }

    this.changeValue()
  }

  updateChosenDate(newDate: NgbDate | null) {
    if (!newDate) this.value.set(null)
    else {
      if (newDate.year < 1000) return

      const date = new Date(newDate.year, newDate.month - 1, newDate.day)
      if (date.toString() === 'Invalid Date' || date.getFullYear() < 1000) return

      this.value.set(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'))
    }
    this.saveValue.emit(this.value())
  }

  changeNumberValue(value: string) {
    value = value.replace(/[^0-9,.]/g, '')
    const number = parseFloat(value.replace(',', '.'))
    if (!isNaN(number)) this.value.set(number)
    else this.value.set(null)
    this.changeValue()
  }

  checkNumberSymbol(value: string, event: KeyboardEvent, cell: HTMLDivElement) {
    if (event.ctrlKey || event.altKey || event.metaKey) return

    if (event.key === ',' && value.includes(',')) event.preventDefault()
    else if (event.key === '.' && value.includes('.')) event.preventDefault()
    else if (event.key === '-' && value.length > 0) event.preventDefault()
    else if (event.key.match(/[0-9,.]/)) return
    else if (event.key.length === 1) event.preventDefault()
    else if (event.key === 'Enter') cell.blur()
    else if (event.key === 'Escape') {
      this.cancelChange()
      cell.innerText = this.valueAsString()
      cell.blur()
    }
  }
}
