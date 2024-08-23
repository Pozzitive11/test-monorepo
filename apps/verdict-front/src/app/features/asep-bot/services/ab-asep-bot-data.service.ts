import { inject, Injectable } from '@angular/core'
import { BufferInfoModel } from '../models/buffer-info.model'
import { AbHttpService } from './ab-http.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { webSocket } from 'rxjs/webSocket'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AbAsepBotDataService {
  private httpService = inject(AbHttpService)
  private messageService = inject(MessageHandlingService)

  ws = environment.asep_socket
  loading: boolean = false
  bufferInfo?: BufferInfoModel

  userFiles: { file: File }[] = []

  uploadedUserFiles: string[] = []

  wsFilesInWorkConnect() {
    return webSocket<string>(
      this.ws + '/files_in_work_socket'
    )
  }

  getBufferInfo(update: boolean) {
    this.loading = true
    this.httpService.getBufferInfo(update)
      .subscribe({
        next: info => this.bufferInfo = info,
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading = false
        },
        complete: () => this.loading = false
      })
  }
}
