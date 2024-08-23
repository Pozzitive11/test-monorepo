import { inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PpHttpClientService } from './pp-http-client.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { DictionaryFullModel } from '../../../shared/models/dictionary-full.model'

@Injectable({
  providedIn: 'root'
})
export class PpSpendingCellsService {
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)

  businesses$ = new BehaviorSubject<DictionaryFullModel[]>([])
  projects$ = new BehaviorSubject<DictionaryFullModel[]>([])
  spendingTypes$ = new BehaviorSubject<DictionaryFullModel[]>([])

  businessSelected$ = new BehaviorSubject<{ row: string, value?: DictionaryFullModel }>({ row: '_' })
  spendingParentTypeSelected$ = new BehaviorSubject<{ row: string, value?: DictionaryFullModel }>({ row: '_' })

  updateBusinesses() {
    this.httpService.getBusinesses()
      .subscribe({
        next: businesses => this.businesses$.next(businesses),
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

  updateProjects() {
    this.httpService.getProjects()
      .subscribe({
        next: projects => this.projects$.next(projects),
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

  updateSpendingTypes() {
    this.httpService.getSpendingTypes()
      .subscribe({
        next: spendingTypes => this.spendingTypes$.next(spendingTypes),
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

}
