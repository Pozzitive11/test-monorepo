import { Component, inject, OnInit } from '@angular/core'
import { InvestProjectsModel } from '../../../models/filters.model'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { CcHttpClientService } from '../../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { NgFor } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-invest-project',
  templateUrl: './invest-project.component.html',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    FormsModule,
    NgFor
  ]
})
export class InvestProjectComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  investProjects: InvestProjectsModel[] = []
  investProjectsFiltered: InvestProjectsModel[] = []
  selectedInvestProjects: InvestProjectsModel[] = []
  textFilter: string = ''

  ngOnInit(): void {
    this.httpService.getInvestProjects()
      .subscribe({
        next: investProjects => {
          this.investProjects = investProjects
          this.selectedInvestProjects = this.investProjects
            .filter((value) => this.ccFilters.selectedInvestProjects.includes(value.id))
          this.textFilter = ''
          this.filterChanged()
        },
        error: err => { this.messageService.sendError(err.error.detail) }
      })
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedInvestProjects = []
    else this.selectedInvestProjects = this.investProjectsFiltered

    this.sendChangesToFilter()
  }

  selectInvestProject(investProject: InvestProjectsModel) {
    if (this.isSelected(investProject)) {
      this.selectedInvestProjects = this.selectedInvestProjects.filter(
        invPrj => { return invPrj.id !== investProject.id }
      )
    } else {
      this.selectedInvestProjects.push(investProject)
    }

    this.sendChangesToFilter()
  }

  isSelected(investProject: InvestProjectsModel) {
    for (let invPrj of this.selectedInvestProjects) {
      if (invPrj.id === investProject.id) { return true }
    }
    return false
  }

  filterChanged() {
    if (this.textFilter.length === 0) this.investProjectsFiltered = this.investProjects

    this.investProjectsFiltered = this.investProjects.filter(
      project => { return project.Name.toLowerCase().includes(this.textFilter.toLowerCase()) }
    )
  }

  private sendChangesToFilter() {
    let investProjectIds: number[] = []
    for (let invPrj of this.selectedInvestProjects) {
      investProjectIds.push(invPrj.id)
    }
    this.ccFilters.investProjectSelected(investProjectIds)
  }
}
