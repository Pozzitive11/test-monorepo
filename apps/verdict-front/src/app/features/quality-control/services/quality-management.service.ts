import { Injectable, inject } from '@angular/core'
import { Supervisor, Contragent, Operator, Recruiter } from '../models/monitoring.models'
import { QualityHttpService } from './quality-http.service'
import { forkJoin } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class QualityManagementService {
  public readonly qualityHttpService = inject(QualityHttpService)

  listType = [
    { id: 2, name: 'Лист оцінки співробітників HR' },
    { id: 1, name: 'Лист оцінки операторів' }
  ]
  supervisorsList: Supervisor[]
  conductedMonitoringList: Supervisor[]
  contragentList: Contragent[]
  operatorsList: Operator[]
  recruiterList: Recruiter[]

  getSelectsList() {
    forkJoin({
      contragentList: this.qualityHttpService.contragentList(),
      operatorsList: this.qualityHttpService.operatorsList(),
      supervisorsList: this.qualityHttpService.supervisorsList(),
      conductedMonitoringList: this.qualityHttpService.specialistList(),
      recruiterList: this.qualityHttpService.recruitersList()
    }).subscribe(({ contragentList, operatorsList, supervisorsList, conductedMonitoringList, recruiterList }) => {
      this.contragentList = contragentList
      this.operatorsList = operatorsList
      this.supervisorsList = supervisorsList
      this.conductedMonitoringList = conductedMonitoringList
      this.recruiterList = recruiterList
    })
  }
}
