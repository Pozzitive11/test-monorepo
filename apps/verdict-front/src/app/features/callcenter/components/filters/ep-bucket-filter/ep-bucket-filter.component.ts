import { Component, inject, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-ep-bucket-filter',
  templateUrl: './ep-bucket-filter.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class EpBucketFilterComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)

  defaultBuckets: string[] = [
    'ВП 5',
    'ВП 10',
    'ВП 15',
    'ВП 25',
    'ВП 50',
    'Відкрито ВП',
    'Немає ВП'
  ]
  selectedBuckets: string[] = []

  ngOnInit(): void {
    this.selectedBuckets = this.ccFilters.selectedEPBuckets
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  selectBucket(bucket: string) {
    if (this.isSelected(bucket)) {
      this.selectedBuckets = this.selectedBuckets.filter(
        selectedBucket => { return selectedBucket !== bucket }
      )
    } else {
      this.selectedBuckets.push(bucket)
    }

    this.sendChangesToFilter()
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedBuckets = []
    else this.selectedBuckets = this.defaultBuckets

    this.sendChangesToFilter()
  }

  isSelected(bucket: string): boolean {
    for (let selectedBucket of this.selectedBuckets) {
      if (selectedBucket === bucket) { return true }
    }
    return false
  }

  private sendChangesToFilter() {
    this.ccFilters.selectedEPBuckets = this.selectedBuckets
  }

}
