import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { FilterDropdown } from '../../../abstract-classes/filter-dropdown.class'
import { Subscription } from 'rxjs'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-reestr-type',
  templateUrl: './reestr-type.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class ReestrTypeComponent extends FilterDropdown implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  private messageService = inject(MessageHandlingService)

  reestrTypes$?: Subscription

  constructor() { super() }

  ngOnInit(): void {
    this.reestrTypes$ = this.ccFilters.reestrTypes
      .subscribe({
        next: reestrTypes => {
          this.allValues = reestrTypes
          this.selectedValues = this.allValues
            .filter(value => this.ccFilters.selectedReestrTypes.includes(value.id))
          this.sendChangesToFilter()
        },
        error: err => { this.messageService.sendError(err.error.detail) },
        complete: () => { this.sendChangesToFilter() }
      })
  }

  ngOnDestroy(): void {
    this.reestrTypes$?.unsubscribe()
  }

  sendChangesToFilter() {
    this.ccFilters.reestrTypesSelected(this.selectedValues.map(value => value.id))
  }

}
