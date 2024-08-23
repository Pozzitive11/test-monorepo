import { Component, inject, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { CcHttpClientService } from '../../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { BucketPipePipe } from '../../../pipes/bucket-pipe.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-debts-filter',
  templateUrl: './debts-filter.component.html',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    NgFor,
    NgbTooltip,
    BucketPipePipe
  ]
})
export class DebtsFilterComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  defaultBuckets: string[] = []
  selectedBuckets: string[] = []

  ngOnInit(): void {
    this.httpService.getBuckets('debts')
      .subscribe({
        next: buckets => {
          this.defaultBuckets = buckets
          this.selectedBuckets = this.defaultBuckets
            .filter((value) => this.ccFilters.selectedDebtsBuckets.includes(value))
          this.sendChangesToFilter()
        },
        error: () => {
          this.messageService.sendError(
            'Не вдалося завантажити бакети по сумі боргу. Спробуйте ще або зверніться до адміністратора.'
          )
        }
      })
  }

  addBucket(validity: ValidityState, value: string): boolean {
    if (validity.valid) {
      this.defaultBuckets.push(value)
      this.defaultBuckets.sort(
        (a, b) => {
          const aNumStr = a.match(/\d+/g)
          const bNumStr = b.match(/\d+/g)
          const aNum: number = aNumStr ? +aNumStr[0] : 0
          const bNum: number = bNumStr ? +bNumStr[0] : 0
          return aNum > bNum ? 1 : -1
        }
      )
      return true
    }
    return false
  }

  saveBuckets() {
    this.httpService.saveBuckets({ buckets: this.defaultBuckets, bucketsType: 'debts' })
      .subscribe({
        error: () => {
          this.messageService.sendError(
            'Помилка при збережені бакетів по сумі боргу. Спробуйте ще або зверніться до адміністратора.'
          )
        },
        complete: () => {
          this.messageService.sendInfo('Бакети збережено')
        }
      })
  }

  deleteChosen() {
    this.defaultBuckets = this.defaultBuckets.filter(
      (bucket) => { return !this.selectedBuckets.includes(bucket) }
    )
    this.selectedBuckets = []
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
    this.ccFilters.selectedDebtsBuckets = this.selectedBuckets
  }
}
