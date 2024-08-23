import { Component, OnDestroy, OnInit } from '@angular/core'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { PpEmptyPaymentIdsService } from '../../services/pp-empty-payment-ids.service'
import { Subscription } from 'rxjs'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'pp-payment-update-errors',
  templateUrl: './pp-payment-update-errors.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbTooltip,
    DecimalPipe
  ]
})
export class PpPaymentUpdateErrorsComponent implements OnInit, OnDestroy {
  dataIsReady$?: Subscription

  get errors() {
    return this.emptyPaymentIdsService.notLoadedPaymentIds
  }

  get checkedErrors() {
    return this.emptyPaymentIdsService.sentPaymentIds
  }

  constructor(
    private emptyPaymentIdsService: PpEmptyPaymentIdsService,
    private dataService: PpTableDataService
  ) { }

  ngOnInit(): void {
    this.emptyPaymentIdsService.updateNotLoadedPaymentIds()

    this.dataIsReady$ = this.dataService.dataIsReady$
      .subscribe(() => this.emptyPaymentIdsService.updateNotLoadedPaymentIds())
  }

  ngOnDestroy(): void {
    this.dataIsReady$?.unsubscribe()
  }

  loadEmptyPaymentIdsIntoTable(limit?: number) {
    this.emptyPaymentIdsService.loadEmptyPaymentIdsIntoTable(limit)
  }

  clearCheckedErrors() {
    this.emptyPaymentIdsService.sentPaymentIds = []
  }
}
