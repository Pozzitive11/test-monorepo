import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { environment } from '../../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class CaseStagesHttpService {
  private http = inject(HttpClient)
  private messageService = inject(MessageHandlingService)

  private url = environment.case_stages


  totalTable(case_type: string) {
    return this.http.get<any>(
      this.url + '/total' + '/' + case_type
    )
  }

  maxTable(case_type: string) {
    return this.http.get<any>(
      this.url + '/max' + '/' + case_type
    )
  }

  downloadTotalTable(case_type: string) {
    this.http.get<Blob>(
      this.url + '/total' + '/' + case_type + '/download',
      { responseType: 'blob' as 'json' }
    ).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, case_type, null),
      error: async error => {
        this.messageService.sendError(JSON.parse(await error.error.text()).detail)
      }
    })
  }

  downloadMaxTable(case_type: string) {
    this.http.get<Blob>(
      this.url + '/max' + '/' + case_type + '/download',
      { responseType: 'blob' as 'json' }
    ).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, case_type, null),
      error: async error => {
        this.messageService.sendError(JSON.parse(await error.error.text()).detail)

      }
    })
  }
}
