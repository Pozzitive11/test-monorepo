import { inject, Injectable } from '@angular/core'
import { PpHttpClientService } from './pp-http-client.service'
import { PpTableDataService } from './pp-table-data.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'

@Injectable({
  providedIn: 'root'
})
export class PpEmptyPaymentIdsService {
  private readonly httpService = inject(PpHttpClientService)
  private readonly dataService = inject(PpTableDataService)
  private readonly messageService = inject(MessageHandlingService)

  notLoadedPaymentIds: string[] = []
  sentPaymentIds: string[] = []

  updateNotLoadedPaymentIds() {
    this.httpService.getEmptyPaymentIds(this.dataService.processType)
      .subscribe({
        next: ids => {
          this.notLoadedPaymentIds = ids
          this.sentPaymentIds = this.sentPaymentIds.filter(id => this.notLoadedPaymentIds.includes(id))
        },
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

  loadEmptyPaymentIdsIntoTable(limit?: number) {
    this.dataService.dataIsLoading$.next(true)
    const idsToSend = this.notLoadedPaymentIds
      .filter(id => !this.sentPaymentIds.includes(id))

    if (limit) {
      this.sentPaymentIds.push(...idsToSend.slice(0, limit))
      this.dataService.uploadDataFromIds(idsToSend.slice(0, limit))
    } else {
      this.sentPaymentIds.push(...idsToSend)
      this.dataService.uploadDataFromIds(idsToSend)
    }
  }
}
