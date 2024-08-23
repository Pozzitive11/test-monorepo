import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, scan, shareReplay } from 'rxjs'
import { ErrorModel } from '../../../shared/models/error.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { PEInfoModel } from '../models/pe-info.model'
import { PeHttpService } from './pe-http.service'

@Injectable({
  providedIn: 'root'
})
export class PeDashboardService {
  private readonly httpService = inject(PeHttpService)
  private readonly messageService = inject(MessageHandlingService)

  loading$ = new BehaviorSubject<boolean>(false)
  privateEntrepreneursInfo$ = new BehaviorSubject<PEInfoModel[]>([])
  privateEntrepreneursHideInfo$ = new BehaviorSubject<number[] | number>([])
  privateEntrepreneursInfoCollapsed$ = this.privateEntrepreneursHideInfo$.pipe(
    scan((acc, curr) => {
      if (Array.isArray(curr))
        return curr
      else {
        const index = acc.indexOf(curr)
        if (index !== -1)
          acc.splice(index, 1)
        else
          acc.push(curr)
        return acc
      }
    }, [] as number[]),
    shareReplay(1)
  )
  privateEntrepreneursSelectAccount$ = new BehaviorSubject<number | null>(null)

  loadPrivateEntrepreneursInfo() {
    this.loading$.next(true)
    this.httpService.getPrivateEntrepreneurs()
      .subscribe({
        next: (peInfo) => {
          this.privateEntrepreneursInfo$.next(peInfo)
          this.privateEntrepreneursHideInfo$.next(peInfo.map(pe => pe.id))
        },
        error: (error: ErrorModel) => {
          this.loading$.next(false)
          this.messageService.sendError(error.error.detail)
        },
        complete: () => this.loading$.next(false)
      })
  }


  isActive(id: number) {
    this.httpService.getPrivateEntrepreneursById(id).subscribe({
      next: (info) => {
        const updatedInfos = this.privateEntrepreneursInfo$.getValue().map(state => {
          if (state.id === id) {
            return { ...state, IsActive: info.IsActive }
          }
          return state
        })

        this.privateEntrepreneursInfo$.next(updatedInfos)
      }
    })
  }

}
