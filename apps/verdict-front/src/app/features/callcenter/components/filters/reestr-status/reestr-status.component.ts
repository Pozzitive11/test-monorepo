import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FilterDropdown } from '../../../abstract-classes/filter-dropdown.class'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { Subscription } from 'rxjs'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'


@Component({
  selector: 'app-reestr-status',
  templateUrl: './reestr-status.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class ReestrStatusComponent extends FilterDropdown implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  private messageService = inject(MessageHandlingService)

  reestrStatuses$?: Subscription

  constructor() { super() }

  ngOnInit(): void {
    this.reestrStatuses$ = this.ccFilters.reestrStatuses
      .subscribe({
        next: reestrStatuses => {
          this.allValues = reestrStatuses
          this.selectedValues = this.allValues
            .filter(value => this.ccFilters.selectedReestrStatuses.includes(value.id))
          this.sendChangesToFilter()
        },
        error: err => { this.messageService.sendError(err.error.detail) },
        complete: () => { this.sendChangesToFilter() }
      })
  }

  ngOnDestroy(): void {
    this.reestrStatuses$?.unsubscribe()
  }

  sendChangesToFilter(): void {
    this.ccFilters.reestrStatusesSelected(this.selectedValues.map(value => value.id))
  }

}
