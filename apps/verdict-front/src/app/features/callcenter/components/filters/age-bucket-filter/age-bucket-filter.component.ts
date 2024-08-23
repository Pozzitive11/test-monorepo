import { Component, inject, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-age-bucket-filter',
  templateUrl: './age-bucket-filter.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class AgeBucketFilterComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)

  defaultBuckets: string[] = [
    '18-21',
    '22-27',
    '28-35',
    '36-45',
    '46-55',
    '56-65',
    '66-70',
    '70+',
    'Не указан'
  ]
  selectedBuckets: string[] = []

  ngOnInit(): void {
    this.selectedBuckets = this.ccFilters.selectedAgeBuckets
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
    this.ccFilters.selectedAgeBuckets = this.selectedBuckets
  }

}

