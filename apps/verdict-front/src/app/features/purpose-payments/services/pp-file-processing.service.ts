import { inject, Injectable } from '@angular/core'
import { PpHttpClientService } from './pp-http-client.service'
import { PaymentsProcessingInfo } from '../../../data-models/server-data.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PpFileProcessingService {
  private readonly http = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)

  progressTimerId: any
  progressUpdate = new Subject<PaymentsProcessingInfo>()
  lastProgressInfo?: PaymentsProcessingInfo

  processPaymentsProgress() {
    this.progressTimerId = setInterval(
      () => {
        this.getProgressInfo()
      }, 500
    )
  }

  private getProgressInfo() {
    this.http.getPaymentsProcessingInfo()
      .subscribe({
        next: value => {
          this.lastProgressInfo = value
          this.progressUpdate.next(value)
          if (value.status.includes('Завершено')) {
            this.messageService.sendInfo(`Обробка файлу "${value.end_file}" завершена`)
            this.stopTimer()
          }
        },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.progressUpdate.next(
            this.lastProgressInfo ? { ...this.lastProgressInfo, status: 'Завершено з помилками' } : {
              uid: undefined,
              status: 'Завершено з помилками',
              progress_info: 'Завершено з помилками',
              progress_percent: 100,
              errors_list: [err.error.detail],
              info_list: [''],
              end_file: undefined
            }
          )
          this.stopTimer()
        }
      })
  }

  stopTimer() {
    if (this.progressTimerId) {
      clearInterval(this.progressTimerId)
    }
  }
}
