import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { TTable } from '../models/basic-types'
import { tap } from 'rxjs'
import { MessageHandlingService } from './message-handling.service'
import { UtilFunctions } from '../utils/util.functions'

@Injectable()
export class CommonOperationsService {
  private readonly url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.common_url

  private readonly http = inject(HttpClient)
  private readonly messageService = inject(MessageHandlingService)

  dataToExcel$(report_data: TTable, filename: string, add_date: boolean = true) {
    return this.http.post(
      this.url + '/data-to-excel',
      { report_data, filename, add_date },
      { responseType: 'blob', observe: 'response' }
    ).pipe(
      tap((res) => {
        try {
          UtilFunctions.saveFileFromHttp(res, true)
        } catch (e) {
          this.messageService.sendError(`Виникла помилка: ${e}`)
        }
      })
    )
  }

  multiTabDataToExcel$(report_data: { [sheet: string]: TTable }, filename: string, add_date: boolean = true) {
    return this.http.post(
      this.url + '/multi-tab-data-to-excel',
      { report_data, filename, add_date },
      { responseType: 'blob', observe: 'response' }
    ).pipe(
      tap((res) => {
        try {
          UtilFunctions.saveFileFromHttp(res, true)
        } catch (e) {
          this.messageService.sendError(`Виникла помилка: ${e}`)
        }
      })
    )
  }
}
