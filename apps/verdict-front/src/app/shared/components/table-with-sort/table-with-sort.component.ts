import { CommonModule, NgIf } from '@angular/common'
import { Component, Input, OnInit, Output, inject, EventEmitter, output, ChangeDetectionStrategy } from '@angular/core'
import { TableWithSortService } from './table-with-sort.service'
import { PaginationComponent } from './pagination/pagination.component'
import { PaginationService } from './pagination/pagination.service'

@Component({
  selector: 'app-table-with-sort',
  standalone: true,
  imports: [CommonModule, NgIf, PaginationComponent],
  templateUrl: './table-with-sort.component.html',
  styleUrl: './table-with-sort.component.css',
  providers: [TableWithSortService, PaginationService]
})
export class TableWithSortComponent implements OnInit {
  protected tableWithSortService = inject(TableWithSortService)
  protected paginationService = inject(PaginationService)
  @Input() tableHeaders: { name: string; key: string }[] = [] // REQUIRED FOR VIEW
  @Input() tableData: any // REQUIRED FOR VIEW
  @Input() booleanTableHeaders: string[] = []
  @Input() dateTableHeaders: string[] = []
  @Input() priceTableHeaders: string[] = []
  @Input() classes: any
  @Input() choseRowParameter: string
  @Input() isPagination: boolean = true
  @Input() isFilters: boolean = true
  @Input() isCheckboxes: boolean = true
  @Output() selectRow = new EventEmitter<{
    rowParameter: any
  }>()
  selectedCheckboxRows = output<number[]>()
  @Input() checkboxesParameter: string
  sortColumn: string | null = null
  sortDirection: 'asc' | 'desc' = 'asc'

  ngOnInit() {
    this.tableWithSortService.filteredTableData.set(this.tableData)
  }

  applyFilter(key: string, value: string) {
    if (!value) {
      this.tableWithSortService.textFilters.update((filters) => {
        return filters.filter((filter) => filter.col !== key)
      })
      this.tableWithSortService.getFilteredApplications(this.tableData)

      return
    }
    this.tableWithSortService.textFilters.update((filters) => {
      const index = filters.findIndex((filter) => filter.col === key)
      if (index === -1) {
        filters.push({ col: key, value })
      } else {
        filters[index].value = value
      }
      return filters
    })

    this.tableWithSortService.getFilteredApplications(this.tableData)
  }

  onChoseRow(rowParameter: any) {
    this.selectRow.emit({ rowParameter })
  }

  sortByColumn(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortColumn = column
      this.sortDirection = 'asc'
    }
    this.tableWithSortService.sortApplications(this.sortColumn, this.sortDirection)
  }
  rowChecked(rowId: number) {
    this.selectedCheckboxRows.emit(this.tableWithSortService.checkedRows)
    return this.tableWithSortService.checkedRows.includes(rowId)
  }
  get allRowsChecked() {
    return this.tableWithSortService.filteredTableData().length === this.tableWithSortService.checkedRows.length
  }
  checkRow(rowId?: number) {
    if (rowId == undefined) {
      if (this.tableWithSortService.filteredTableData().length === this.tableWithSortService.checkedRows.length) {
        this.tableWithSortService.checkedRows = []
      } else {
        this.tableWithSortService.checkedRows = this.tableWithSortService
          .filteredTableData()
          .map((value) => value[this.checkboxesParameter])
      }
      return
    }

    if (this.tableWithSortService.checkedRows.includes(rowId)) {
      this.tableWithSortService.checkedRows = this.tableWithSortService.checkedRows.filter((value) => value !== rowId)
    } else {
      this.tableWithSortService.checkedRows.push(rowId)
    }

    this.selectedCheckboxRows.emit(this.tableWithSortService.checkedRows)
  }
}
