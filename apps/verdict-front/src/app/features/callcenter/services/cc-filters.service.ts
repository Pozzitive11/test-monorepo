import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'
import { CcHttpClientService } from './cc-http-client.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import {
  DictionaryModel,
  InputProjectParameters,
  InputReestrFromInvestProjects,
  InputReestrParameters,
  ProjectFilterModel,
  ReestrFilterModel
} from '../models/filters.model'
import { RPCNCInfoModel } from '../models/report-models'

@Injectable({
  providedIn: 'root'
})
export class CcFiltersService {
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  EPBucketCols: { col: string, name: string }[] = [
    { col: 'IP5Count', name: 'ВП 5' },
    { col: 'IP10Count', name: 'ВП 10' },
    { col: 'IP15Count', name: 'ВП 15' },
    { col: 'IP25Count', name: 'ВП 25' },
    { col: 'IP50Count', name: 'ВП 50' },
    { col: 'IPCount', name: 'Відкрито ВП' }
  ]
  reestrStatuses = new BehaviorSubject<DictionaryModel[]>([])
  reestrTypes = new BehaviorSubject<DictionaryModel[]>([])

  reestrChange = new Subject<ReestrFilterModel[]>()
  projectsChange = new Subject<ProjectFilterModel[]>()
  excludedLoginsChange = new Subject<string[]>()

  selectedRnumbers: number[] = []
  isActual: boolean = true
  isInvestProjectOnly: boolean = false
  selectedManagerIds: number[] = []
  selectedReestrTypes: number[] = []
  selectedReestrStatuses: number[] = []

  selectedProjects: number[] = []
  selectedInvestProjects: number[] = []

  selectedAgeBuckets: string[] = []
  selectedEPBuckets: string[] = []
  selectedDPDBuckets: string[] = []
  selectedDebtsBuckets: string[] = []
  selectedExcludedLogins: string[] = []

  selectedSegmentationTypes: string[] = []

  totalInfo: RPCNCInfoModel[] = []
  totalInfoFiltered: RPCNCInfoModel[] = []

  textFilters: string[] = ['']
  textFiltersStream = new BehaviorSubject<string[]>(this.textFilters.slice())

  constructor() { this.getReestrStatusesAndTypes() }

  getReestrStatusesAndTypes() {
    this.httpService.getReestrStatuses()
      .subscribe({
        next: reestrStatuses => {
          this.selectedReestrStatuses = reestrStatuses.map(value => value.id)
          this.reestrStatuses.next(reestrStatuses)
        },
        error: () => {
          this.messageService.sendError('Не вдалося завантажити статуси реєстрів. Оновіть сторінку або зверніться до адміністратора')
        }
      })

    this.httpService.getReestrTypes()
      .subscribe({
        next: reestrTypes => {
          this.selectedReestrTypes = reestrTypes.map(value => value.id)
          this.reestrTypes.next(reestrTypes)
        },
        error: () => {
          this.messageService.sendError('Не вдалося завантажити типи реєстрів. Оновіть сторінку або зверніться до адміністратора')
        }
      })
  }


  projectManagerSelected(managerIds: number[]) {
    this.selectedManagerIds = managerIds
    if (managerIds.length === 0) {
      this.projectsChange.next([])
      return
    }

    const input_data: InputProjectParameters = {
      isActual: this.isActual,
      ManagerID: this.selectedManagerIds
    }
    this.httpService.getProjects(input_data)
      .subscribe({
        next: projects => { this.projectsChange.next(projects) },
        error: err => { this.messageService.sendError(err.error.detail) }
      })
  }


  projectsSelected(projectIds: number[]) {
    this.selectedProjects = projectIds
    if (projectIds.length === 0 || this.selectedReestrTypes.length === 0) {
      this.reestrChange.next([])
      return
    }

    this.updateReestrs()
  }

  isActualChanged(isActual: boolean) {
    this.isActual = isActual
    this.updateReestrs()
  }

  investProjectSelected(investProjectIds: number[]) {
    this.selectedInvestProjects = investProjectIds
    if (investProjectIds.length === 0 || this.selectedReestrTypes.length === 0) {
      this.reestrChange.next([])
      return
    }

    this.updateReestrs()
  }

  reestrTypesSelected(reestrTypeIds: number[]) {
    this.selectedReestrTypes = reestrTypeIds
    if (reestrTypeIds.length === 0) {
      this.reestrChange.next([])
      return
    }

    this.updateReestrs()
  }

  reestrStatusesSelected(reestrStatusIds: number[]) {
    this.selectedReestrStatuses = reestrStatusIds
    if (reestrStatusIds.length === 0) {
      this.reestrChange.next([])
      return
    }

    this.updateReestrs()
  }

  switchReestrMode() {
    this.selectedManagerIds = []
    this.selectedRnumbers = []

    this.selectedProjects = []
    this.selectedInvestProjects = []

    this.reestrChange.next([])
    this.projectsChange.next([])
  }

  private updateReestrs() {
    if (this.selectedProjects.length > 0) {
      const input_data: InputReestrParameters = {
        isActual: this.isActual,
        ReestrTypes: this.selectedReestrTypes,
        ReestrStatuses: this.selectedReestrStatuses,
        ProjectID: this.selectedProjects
      }
      this.httpService.getReestrs(input_data)
        .subscribe({
          next: reestrs => {
            this.selectedRnumbers = this.selectedRnumbers
              .filter(value => reestrs.some((val) => val.Rnumber === value))
            this.reestrChange.next(reestrs)
          },
          error: err => { this.messageService.sendError(err.error.detail) }
        })
      return
    }

    if (this.selectedInvestProjects.length > 0) {
      const input_data: InputReestrFromInvestProjects = {
        isActual: this.isActual,
        ReestrTypes: this.selectedReestrTypes,
        ReestrStatuses: this.selectedReestrStatuses,
        ProjectIDs: this.selectedInvestProjects
      }
      this.httpService.getReestrsFromInvestProjects(input_data)
        .subscribe({
          next: reestrs => {
            this.selectedRnumbers = this.selectedRnumbers
              .filter(value => reestrs.some((val) => val.Rnumber === value))
            this.reestrChange.next(reestrs)
          },
          error: err => { this.messageService.sendError(err.error.detail) }
        })
      return
    }

  }

  updateExcludedLogins(year: number, month: number) {
    this.httpService.getExcludedLogins(year, month)
      .subscribe({
        next: excludedLogins => { this.excludedLoginsChange.next(excludedLogins) },
        error: err => { this.messageService.sendError(err.error.detail) }
      })
  }

  filterTotalData(reestrTypes: string[], reestrStatuses: string[]) {
    this.totalInfoFiltered = this.totalInfo.filter(
      (info) => { return reestrTypes.includes(info.ReestrType) && reestrStatuses.includes(info.ReestrStatus) }
    )
  }

  getTotalNoPhonePercent() {
    if (this.totalInfoFiltered.length === 0)
      return undefined
    const TotalContractsCount = this.totalInfoFiltered.reduce(
      (acc, obj) => { return acc + obj.ContractsCount }, 0
    )
    const NonActualCount = this.totalInfoFiltered.reduce(
      (acc, obj) => { return acc + obj.noPhone + obj.nonActualCount }, 0
    )

    return TotalContractsCount > 0 ? NonActualCount / TotalContractsCount * 100 : 0
  }
}
