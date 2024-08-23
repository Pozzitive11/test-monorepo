import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'


@Component({
  selector: 'app-no-take-account-of-filter',
  templateUrl: './excluded-logins-filter.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class ExcludedLoginsFilterComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)

  excludedLoginsChange?: Subscription
  excludedLogins: string[] = []
  selectedExcludedLogins: string[] = []

  ngOnInit(): void {
    this.excludedLoginsChange = this.ccFilters.excludedLoginsChange
      .subscribe({
        next: excludedLogins => {
          this.excludedLogins = excludedLogins
          this.selectedExcludedLogins = this.excludedLogins
            .filter(login => this.ccFilters.selectedExcludedLogins.includes(login))
        }
      })
  }

  ngOnDestroy(): void {
    this.excludedLoginsChange?.unsubscribe()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  selectTakeAccount(person: string) {
    if (this.isSelected(person)) {
      this.selectedExcludedLogins = this.selectedExcludedLogins.filter(
        prsn => { return person !== prsn }
      )
    } else {
      this.selectedExcludedLogins.push(person)
    }

    this.sendChangesToFilter()
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectedExcludedLogins = []
    else this.selectedExcludedLogins = this.excludedLogins

    this.sendChangesToFilter()
  }

  isSelected(person: string): boolean {
    for (let prsn of this.selectedExcludedLogins) {
      if (prsn === person) { return true }
    }
    return false
  }

  private sendChangesToFilter() {
    this.ccFilters.selectedExcludedLogins = this.selectedExcludedLogins
  }

}
