import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { Subscription } from 'rxjs'
import { ReestrFilterModel } from '../../../models/filters.model'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'


@Component({
  selector: 'app-reestr',
  templateUrl: './reestr.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class ReestrComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)

  reestrChange?: Subscription
  reestrs: ReestrFilterModel[] = []
  selected_reestrs: ReestrFilterModel[] = []

  ngOnInit(): void {
    this.reestrChange = this.ccFilters.reestrChange
      .subscribe({
        next: reestrs => {
          this.reestrs = reestrs
          this.selected_reestrs = this.reestrs
            .filter(value => this.ccFilters.selectedRnumbers.includes(value.Rnumber))
          this.sendChangesToFilter()
        }
      })
  }

  ngOnDestroy(): void {
    this.reestrChange?.unsubscribe()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  selectReestr(reestr: ReestrFilterModel) {
    if (this.isSelected(reestr)) {
      this.selected_reestrs = this.selected_reestrs.filter(rstr => rstr.Rnumber !== reestr.Rnumber)
    } else {
      this.selected_reestrs.push(reestr)
    }

    this.sendChangesToFilter()
  }

  clearChosen(clear: boolean) {
    if (clear) this.selected_reestrs = []
    else this.selected_reestrs = this.reestrs

    this.sendChangesToFilter()
  }

  isSelected(reestr: ReestrFilterModel): boolean {
    for (let selR of this.selected_reestrs) {
      if (selR.Rnumber === reestr.Rnumber) { return true }
    }
    return false
  }

  private sendChangesToFilter() {
    this.ccFilters.selectedRnumbers = this.selected_reestrs.map(value => value.Rnumber)
  }
}



