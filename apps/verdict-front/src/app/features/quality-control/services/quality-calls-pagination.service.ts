import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs'
import { QualityCallsService } from './quality-calls.service'
import { Call } from '../models/calls.model'

@Injectable({
  providedIn: 'root'
})
export class QualityCallsPaginationService {
  private readonly qualityCallsService = inject(QualityCallsService)

  readonly FILTER_PAG_REGEX = /[^0-9]/g
  readonly pageSize = 10
  page = 1

  private _paginatedCalls$ = new BehaviorSubject<Call[]>([])
  paginatedCredits$ = from(this._paginatedCalls$)

  calculatePageCredits(): Observable<Call[]> {
    return this.qualityCallsService.callsList$.pipe(
      map((allCredits) => {
        const startIndex = (this.page - 1) * this.pageSize
        const endIndex = startIndex + this.pageSize

        return allCredits.slice(startIndex, endIndex)
      }),
      tap((paginatedCredits) => {
        this._paginatedCalls$.next(paginatedCredits)
      })
    )
  }

  selectPage(page: any): void {
    this.page = +page
    this.calculatePageCredits().subscribe()
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '')
  }
}
