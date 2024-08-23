import { Component, EventEmitter, input, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-max-page-rows-filter',
  templateUrl: './max-page-rows-filter.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class MaxPageRowsFilterComponent {
  class = input<string>('align-items-baseline d-flex flex-row flex-wrap gap-2')
  @Input() maxRowsPerPage: number = 30
  maxRowsPerPage_old: number = 30

  @Output() maxRowsPerPageChange = new EventEmitter<number>()

  updateMaxRows() {
    if (this.maxRowsPerPage === this.maxRowsPerPage_old) { return }
    if (this.maxRowsPerPage <= 0)
      this.maxRowsPerPage = 1
    this.maxRowsPerPage_old = this.maxRowsPerPage
    this.maxRowsPerPageChange.emit(this.maxRowsPerPage)
  }

  processClick() {
    if (this.maxRowsPerPage_old !== this.maxRowsPerPage) {
      if (this.maxRowsPerPage <= 0)
        this.maxRowsPerPage = 1
      this.maxRowsPerPage_old = this.maxRowsPerPage
      this.maxRowsPerPageChange.emit(this.maxRowsPerPage)
    }
  }
}
