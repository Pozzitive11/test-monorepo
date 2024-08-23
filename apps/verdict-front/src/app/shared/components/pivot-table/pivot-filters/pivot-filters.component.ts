import { Component, inject, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { pivotValueToString } from '../utils/transform.functions'
import { TextFiltersComponent } from '../../filters/text-filters/text-filters.component'
import { TextFilterModel } from '../../filters/models/text-filter-model'
import { numberFilterTypes, textFilterTypes } from '../../filters/models/filter-types.constant'
import { SearchableListComponent } from '../../searchable-list/searchable-list.component'
import { NumberFiltersComponent } from '../../filters/number-filters/number-filters.component'
import { NumberFilterModel } from '../../filters/models/number-filter.model'
import { numbersFilter } from '../utils/filter.functions'
import { TValue } from '../../../models/basic-types'

@Component({
  selector: 'pivot-filters',
  standalone: true,
  imports: [CommonModule, TextFiltersComponent, SearchableListComponent, NumberFiltersComponent],
  templateUrl: './pivot-filters.component.html',
  styleUrls: ['../pivot-table.component.css']
})
export class PivotFiltersComponent implements OnInit {
  activeModal = inject(NgbActiveModal)

  readonly emptyReplacement = '(пусті)'

  @Input() columnValues: TValue[] = []
  @Input() columnName: string = '(помилка)'

  valueTypes: string[] = []

  @Input() selectedValues: string[] = []
  displayedValues: string[] = []
  richTextFilters: { inEdit: boolean, filter: TextFilterModel } = {
    inEdit: false,
    filter: { not: false }
  }
  numberFilters: { inEdit: boolean, filter: NumberFilterModel } = {
    inEdit: false,
    filter: { not: false }
  }


  get numbersInColumn() {
    return this.valueTypes.includes('number')
  }

  get datesInColumn() {
    return this.valueTypes.includes('Date')
  }

  get richTextFiltersPlaceholder() {
    const filterText: [string, string][] = []
    const isNot = this.richTextFilters.filter.not ? 'не ' : ''

    if (this.richTextFilters.filter.eq)
      filterText.push([`${isNot} ${textFilterTypes.eq}`, `${this.richTextFilters.filter.eq}`])
    if (this.richTextFilters.filter.startsWith)
      filterText.push([`${isNot} ${textFilterTypes.startsWith}`, `${this.richTextFilters.filter.startsWith}`])
    if (this.richTextFilters.filter.endsWith)
      filterText.push([`${isNot} ${textFilterTypes.endsWith}`, `${this.richTextFilters.filter.endsWith}`])
    if (this.richTextFilters.filter.includes)
      filterText.push([`${isNot} ${textFilterTypes.includes}`, `${this.richTextFilters.filter.includes}`])

    return filterText
  }

  get numberFiltersPlaceholderText() {
    const filterText: [string, string][] = []
    const isNot = this.numberFilters.filter.not ? '!' : ''

    if (this.numberFilters.filter.eq !== undefined)
      filterText.push([`${isNot} ${numberFilterTypes.eq}`, `${this.numberFilters.filter.eq}`])
    if (this.numberFilters.filter.ge !== undefined)
      filterText.push([`${numberFilterTypes.ge}`, `${this.numberFilters.filter.ge}`])
    if (this.numberFilters.filter.le !== undefined)
      filterText.push([`${numberFilterTypes.le}`, `${this.numberFilters.filter.le}`])
    if (this.numberFilters.filter.greater !== undefined)
      filterText.push([`${numberFilterTypes.greater}`, `${this.numberFilters.filter.greater}`])
    if (this.numberFilters.filter.less !== undefined)
      filterText.push([`${numberFilterTypes.less}`, `${this.numberFilters.filter.less}`])

    return filterText
  }

  ngOnInit(): void {
    this.valueTypes = []
    this.displayedValues = []
    this.columnValues = [...new Set(this.columnValues)]

    for (const value of this.columnValues) {
      this.valueTypes.push(value instanceof Date ? 'Date' : typeof value)
      this.displayedValues.push(pivotValueToString(value, this.emptyReplacement))
    }

    this.valueTypes = [...new Set(this.valueTypes)]
    this.displayedValues = [...new Set(this.displayedValues)]
  }

  onFilterChange() {
    if (this.numbersInColumn && this.numberFiltersPlaceholderText.length)
      this.onNumberFilterChange()
    else
      this.displayedValues = this.columnValues.map(value => pivotValueToString(value, this.emptyReplacement))

    if (this.richTextFiltersPlaceholder.length)
      this.onTextFilterChange(this.displayedValues)
  }


  onTextFilterChange(chainedList?: string[]) {
    const filter = this.richTextFilters.filter
    if (!chainedList)
      chainedList = this.columnValues.map(value => pivotValueToString(value, this.emptyReplacement))

    this.displayedValues = chainedList
      .filter(value => {
        let isIncluded = true

        if (filter.includes) {
          isIncluded = filter.not ? !value.includes(filter.includes) : value.includes(filter.includes)
        }
        if (filter.startsWith && isIncluded) {
          isIncluded = filter.not ? !value.startsWith(filter.startsWith) : value.startsWith(filter.startsWith)
        }
        if (filter.endsWith && isIncluded) {
          isIncluded = filter.not ? !value.endsWith(filter.endsWith) : value.endsWith(filter.endsWith)
        }
        if (filter.eq && isIncluded) {
          isIncluded = filter.not ? value !== filter.eq : value === filter.eq
        }

        return isIncluded
      })
  }

  onNumberFilterChange() {
    const filter = this.numberFilters.filter

    this.displayedValues = numbersFilter(this.columnValues)
      .filter(value => {
        let included = true

        if (filter.ge != undefined)
          included = value >= filter.ge
        if (filter.le != undefined && included)
          included = value <= filter.le
        if (filter.greater != undefined && included)
          included = value > filter.greater
        if (filter.less != undefined && included)
          included = value < filter.less
        if (filter.eq != undefined && included)
          included = filter.not ? value !== filter.eq : value === filter.eq

        return included
      })
      .map(value => pivotValueToString(value, this.emptyReplacement))
  }

  onSelectedValuesChange(selectedValues: string[]) {
    if (this.displayedValues.length === this.columnValues.length) {
      this.selectedValues = [...selectedValues]
    } else {
      this.selectedValues = this.selectedValues
        .filter(value => !this.displayedValues.includes(value))
        .concat(selectedValues)
    }
  }
}
