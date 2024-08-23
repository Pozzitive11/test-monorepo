import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { ManagerFilterModel } from '../../../models/filters.model'
import { CcHttpClientService } from '../../../services/cc-http-client.service'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  projectManagersChange?: Subscription
  projectManagers: ManagerFilterModel[] = []
  selectedManagers: ManagerFilterModel[] = []

  ngOnInit(): void {
    this.httpService.getProjectManagers()
      .subscribe({
        next: managers => {
          this.projectManagers = managers
          this.selectedManagers = this.projectManagers
            .filter((value) => this.ccFilters.selectedManagerIds.includes(value.ManagerId))
          this.sendChangesToFilter()
        },
        error: err => { this.messageService.sendError(err.error.detail) }
      })
  }

  ngOnDestroy(): void {
    this.projectManagersChange?.unsubscribe()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedManagers = []
    else this.selectedManagers = this.projectManagers

    this.sendChangesToFilter()
  }

  selectManager(manager: ManagerFilterModel) {
    if (this.isSelected(manager)) {
      this.selectedManagers = this.selectedManagers.filter(
        mngr => { return mngr.ManagerId !== manager.ManagerId }
      )
    } else {
      this.selectedManagers.push(manager)
    }

    this.sendChangesToFilter()
  }

  isSelected(manager: ManagerFilterModel) {
    for (let mngr of this.selectedManagers) {
      if (mngr.ManagerId === manager.ManagerId) { return true }
    }
    return false
  }

  private sendChangesToFilter() {
    let managerIds: number[] = []
    for (let mngr of this.selectedManagers) {
      managerIds.push(mngr.ManagerId)
    }
    this.ccFilters.projectManagerSelected(managerIds)
  }
}
