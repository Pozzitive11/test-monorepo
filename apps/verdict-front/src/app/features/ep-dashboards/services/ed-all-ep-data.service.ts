import { HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { EdHttpService } from './ed-http.service'
import { AllEpData } from '../models/ed-all-data.model'

@Injectable({
  providedIn: 'root'
})
export class EdAllEpDataService {
  private readonly httpService = inject(EdHttpService)
  private readonly messageService = inject(MessageHandlingService)

  loadAllEpCountInfo(
    checked: boolean = false,
    known: boolean = false,
    buffer: boolean = false,
    ended: boolean = false,
    active: boolean = false
  ) {
    return this.httpService.loadAllEpCountInfo(checked, known, buffer, ended, active)
      .pipe(
        map(count => count === 0 ? Number.EPSILON : count),
        catchError(async (err: HttpErrorResponse) => {
          console.log(err.error.error)
          console.log(err.message)
          await this.messageService.alertError(err.error)
          return Number.NEGATIVE_INFINITY
        })
      )
  }

  loadAllEpWithStatusCountInfo(
    epStatus: 'active' | 'ended' | 'buffer',
    notOurDebtor: boolean = false,
    ourEp: boolean = false,
    notOurs: boolean = false,
    creditorsEp: boolean = false,
    unknownDebtor: boolean = false
  ) {
    return this.httpService.loadAllEpWithStatusCountInfo(epStatus, notOurDebtor, ourEp, notOurs, creditorsEp, unknownDebtor)
      .pipe(
        map(count => count === 0 ? Number.EPSILON : count),
        catchError(async (err: HttpErrorResponse) => {
          await this.messageService.alertError(err)
          return Number.NEGATIVE_INFINITY
        })
      )
  }

  loadAllEpCountCreditorsEp(
    epStatus: 'active' | 'ended',
    epState: 'before' | 'after' | 'other',
    notOurs: boolean = false,
    noSideChange: boolean = false,
    sideChanged: boolean = false
  ) {
    return this.httpService.loadAllEpCountCreditorsEp(epStatus, epState, notOurs, noSideChange, sideChanged)
      .pipe(
        map(count => count === 0 ? Number.EPSILON : count),
        catchError(async (err: HttpErrorResponse) => {
          await this.messageService.alertError(err)
          return Number.NEGATIVE_INFINITY
        })
      )
  }

  cachedResults: { [key: string]: number } = {}

  loadAllWithBase() {
    if (Object.keys(this.cachedResults).length > 0) {
      // Если данные уже есть, возвращаем их как Observable
      return of(this.cachedResults)
    }
    return this.httpService.loadAllEpData().pipe(
      map((data) => {
        // Проходим по каждому ключу в data и добавляем соответствующий Observable в cachedResults
        Object.keys(data)
          .filter((key): key is (keyof AllEpData) => key in data)
          .forEach((key) => {
            this.cachedResults[key] = data[key]
          })
        return this.cachedResults
      })
    )
  }

}
