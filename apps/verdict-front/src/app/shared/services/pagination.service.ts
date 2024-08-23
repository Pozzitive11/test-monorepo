import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, from, Observable, combineLatest } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { DcSendingDocsFiltersService } from '../../features/discounts/services/dc-sending-docs-filters.service'

const PAGE_SIZE = 10

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  readonly FILTER_PAG_REGEX = /[^0-9]/g
  private readonly sendingDocsFiltersService = inject(DcSendingDocsFiltersService)

  private _collectionSize$ = new BehaviorSubject<number>(0)
  collectionSize$ = this._collectionSize$.asObservable()

  private _paginatedCredits$ = new BehaviorSubject<{ [key: string]: any }[]>([])
  paginatedCredits$ = this._paginatedCredits$.asObservable()

  private _pageSize$ = new BehaviorSubject<number>(PAGE_SIZE)
  pageSize$ = this._pageSize$.asObservable()

  private _page$ = new BehaviorSubject<number>(1)
  page$ = this._page$.asObservable()

  constructor() {
    this.calculateNumberOfPages()
    this.calculatePageCredits().subscribe()
  }

  calculatePageCredits(): Observable<{ [key: string]: any }[]> {
    return combineLatest([this.sendingDocsFiltersService.filteredCredits$, this._pageSize$, this._page$]).pipe(
      map(([allCredits, pageSize, page]) => {
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        return allCredits.slice(startIndex, endIndex)
      }),
      tap((paginatedCredits) => {
        this._paginatedCredits$.next(paginatedCredits)
      })
    )
  }

  calculateNumberOfPages() {
    this.sendingDocsFiltersService.filteredCredits$
      .pipe(
        map((data) => data.length),
        tap((totalItems) => {
          this._collectionSize$.next(totalItems)
        })
      )
      .subscribe()
  }

  selectPage(page: any): void {
    this._page$.next(+page)
    this.calculatePageCredits().subscribe()
  }

  setPageSize(pageSize: number): void {
    this._pageSize$.next(pageSize)
    this._page$.next(1) // reset to first page
    this.calculatePageCredits().subscribe()
    this.calculateNumberOfPages()
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '')
  }
}
