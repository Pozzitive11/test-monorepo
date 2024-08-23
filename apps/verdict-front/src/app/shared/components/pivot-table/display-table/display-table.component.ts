import { CommonModule } from '@angular/common'
import { Component, computed, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { FormatAnyValuePipe } from '../../../pipes/format-any-value.pipe'
import { PivotTableModel } from '../models/pivot-table.model'
import { TableWithFiltersComponent } from '../../table-with-filters/table-with-filters.component'

@Component({
  selector: 'pivot-display-table',
  standalone: true,
  imports: [CommonModule, FormatAnyValuePipe, NgbPagination, TableWithFiltersComponent],
  templateUrl: './display-table.component.html',
  styleUrls: ['../pivot-table.component.css']
})
export class DisplayTableComponent implements OnChanges {
  @Input() rowsPerPage: number = 100
  @Input() firstRowName: string = ''
  @Input() sep: string = '|'
  @Input() totalRowName: string = 'Всього'
  @Input() tableLevels: number = 0
  @Input() hiddenLevels: string[] = []
  @Input() tableIndex: string[] = []
  @Input() tableColumns: string[] = []
  @Input() sorting: { [col: string]: boolean | undefined } = {}
  @Input() tableHigherLevels: string[] = []
  @Input() tableRowNames: { [row: string]: string[] } = {}
  @Input() displayedTable: PivotTableModel = {}
  @Input() useRedZone: boolean = true
  @Input() classesForRedZone: { [row: string]: { [col: string]: string } } = {}
  @Input() redZoneColumns: string[] = []
  @Input() percentColumns: string[] = []

  @Output() hiddenLevelsChange = new EventEmitter<string[]>()
  @Output() sortingChange = new EventEmitter<{ [key: string]: boolean | undefined }>()
  @Output() basicTableViewSelected = new EventEmitter<{ rowName: string, col: string | null }>()

  page = signal<number>(1)
  rowsList = signal<{ zeroLevel: string, rowName: string }[]>([])
  rowsListPage = computed(() => {
    const fullRowsList = this.rowsList()
    const page = this.page()

    if (fullRowsList.length <= this.rowsPerPage)
      return fullRowsList

    const rowsPerPage = this.rowsPerPage
    let startRow = (page - 1) * rowsPerPage
    let endRow = page * rowsPerPage

    return fullRowsList.slice(startRow, endRow)
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableHigherLevels'] || changes['tableRowNames']) {
      const rowsList: { zeroLevel: string, rowName: string }[] = []
      this.tableHigherLevels.forEach((rowName) => {
        rowsList.push(...this.tableRowNames[rowName].map((name) => ({ zeroLevel: rowName, rowName: name })))
      })

      this.rowsList.set(rowsList)
    }
  }

  toggleLevel(rowName: string | null) {
    if (rowName === null) {
      if (this.hiddenLevels.length === 0)
        return this.hiddenLevelsChange.emit([...this.tableIndex])

      return this.hiddenLevelsChange.emit([])
    }

    if (this.hiddenLevels.includes(rowName))
      this.hiddenLevelsChange.emit(this.hiddenLevels.filter((name) => name !== rowName))
    else
      this.hiddenLevelsChange.emit(this.hiddenLevels.concat([rowName]))
  }

  updateSorting(columnName: string) {
    if (this.sorting[columnName] === undefined)
      this.sorting[columnName] = true
    else if (this.sorting[columnName] === true)
      this.sorting[columnName] = false
    else
      delete this.sorting[columnName]

    this.sortingChange.emit({ ...this.sorting })
  }

  getLevel(rowName: string) {
    return rowName.split(this.sep).length - 1
  }

  getLevelNumbersArray(name: string): number[] {
    return Array(this.getLevel(name)).fill(0)
  }

  displaySubLevelName(name: string) {
    return name.split(this.sep).slice(-1).join(this.sep)
  }

  basicTableView(rowName: string, col: string | null) {
    this.basicTableViewSelected.emit({ rowName, col })
  }

  isNumber(value: any): value is number {
    return typeof value === 'number'
  }
}
