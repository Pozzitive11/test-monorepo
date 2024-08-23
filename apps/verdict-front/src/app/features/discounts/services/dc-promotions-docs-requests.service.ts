import { computed, inject, Injectable, signal } from '@angular/core'
import { retry } from 'rxjs'
import { DcHttpService } from './dc-http.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { DcPromotionDocsRequestsInfoModel } from '../models/dc-promotion-docs-requests-info.model'
import { DcPromotionSimpleWithDocsReqModel } from '../models/dc-promotion-simple-with-docs-req.model'

@Injectable({
  providedIn: 'root'
})
export class DcPromotionsDocsRequestsService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)

  loading = signal<boolean>(false)

  docsRequestsInfo = signal<DcPromotionDocsRequestsInfoModel>({
    NewRequests: 0,
    TotalRequests: 0
  })
  docsRequests = signal<DcPromotionSimpleWithDocsReqModel[]>([])
  selectedRequestIds = signal<number[]>([])

  // ------------------ Pagination ------------------

  totalRequests = computed(() => {
    return this.showOnlyNewRequests() ?
      this.docsRequestsInfo().NewRequests : this.docsRequestsInfo().TotalRequests
  })
  showOnlyNewRequests = signal<boolean>(true)
  recordsOnPage = signal<number>(30)
  currentPage = signal<number>(1)
  offset = computed(() => this.recordsOnPage() * (this.currentPage() - 1))

  // ------------------ Pagination ------------------


  loadDocsRequestsInfo(callback: () => void = () => {}) {
    this.httpService.loadDocsRequestsInfo()
      .pipe(retry(3))
      .subscribe({
        next: (info) => this.docsRequestsInfo.set(info),
        error: err => this.messageService.sendError(err.error.detail),
        complete: () => {
          this.currentPage.set(1)
          callback()
        }
      })
  }

  loadDocsRequests() {
    this.loading.set(true)
    const offset = this.offset()

    this.httpService.loadDocsRequests(offset, this.recordsOnPage(), this.showOnlyNewRequests())
      .subscribe({
        next: (requests) => this.docsRequests.set(requests),
        error: err => {
          if (offset === 0)
            this.messageService.sendError(err.error.detail)
          else
            this.currentPage.set(1)
          this.loading.set(false)
        },
        complete: () => {
          this.currentPage.set(this.currentPage())
          this.loading.set(false)
        }
      })
  }

  checkDocumentRequests() {
    this.loading.set(true)

    this.httpService.checkDocumentRequests(this.selectedRequestIds())
      .subscribe({
        next: (data) => this.messageService.sendInfo(data.description),
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading.set(false)
        },
        complete: () => this.loading.set(false)
      })
  }
}
