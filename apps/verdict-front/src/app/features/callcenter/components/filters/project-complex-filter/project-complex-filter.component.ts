import { Component, inject, Input } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-project-complex-filter',
  templateUrl: './project-complex-filter.component.html',
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class ProjectComplexFilterComponent {
  private ccFilters = inject(CcFiltersService)

  @Input() id: number = 0
  @Input() filter: string = ''

  addFilter() {
    this.ccFilters.textFilters.push('')
    this.ccFilters.textFiltersStream.next(this.ccFilters.textFilters.slice())
  }

  filterChanged() {
    this.ccFilters.textFilters[this.id] = this.filter
    this.ccFilters.textFiltersStream.next(this.ccFilters.textFilters.slice())
  }

  close() {
    if (this.isLastFilter()) {
      this.filter = ''
      this.filterChanged()
      return
    }
    this.ccFilters.textFilters = this.ccFilters.textFilters.filter((value, index) => index !== this.id)
    this.ccFilters.textFiltersStream.next(this.ccFilters.textFilters.slice())
  }

  isLastFilter() {
    return this.id === this.ccFilters.textFilters.length - 1
  }

  isOnlyFilter() {
    return this.ccFilters.textFilters.length > 1
  }
}



