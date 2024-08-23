import { Component, inject, OnInit } from '@angular/core'
import { DictionaryModel } from '../../../models/filters.model'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { CcHttpClientService } from '../../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { RPCNCInfoModel } from '../../../models/report-models'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-cc-segments-rpc-nc-total-info-box',
  templateUrl: './cc-segments-rpc-nc-total-info-box.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    ClickOutsideDirective,
    NgFor,
    DecimalPipe
  ]
})
export class CcSegmentsRpcNcTotalInfoBoxComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  reestrStatuses: DictionaryModel[] = []
  reestrTypes: DictionaryModel[] = []

  selectedReestrStatuses: DictionaryModel[] = []
  selectedReestrTypes: DictionaryModel[] = []

  updating: boolean = false
  totalInfoPercent: number = 0

  ngOnInit(): void {
    this.updating = true
    this.httpService.getReestrStatuses()
      .subscribe({
        next: reestrStatuses => {
          this.reestrStatuses = reestrStatuses
          this.selectedReestrStatuses = reestrStatuses
        },
        error: err => { this.messageService.sendError(err.error.detail) },
        complete: () => { this.updateTotalInfo() }
      })

    this.httpService.getReestrTypes()
      .subscribe({
        next: reestrTypes => {
          this.reestrTypes = reestrTypes
          this.selectedReestrTypes = reestrTypes
        },
        error: err => { this.messageService.sendError(err.error.detail) },
        complete: () => { this.updateTotalInfo() }
      })

    this.httpService.getSegmentsRpcNcTotals()
      .subscribe({
        next: totalInfo => { this.ccFilters.totalInfo = totalInfo },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.updating = false
        },
        complete: () => { this.updateTotalInfo() }
      })
  }

  get totalInfo(): RPCNCInfoModel[] {
    return this.ccFilters.totalInfo
  }

  // get totalInfoPercent(): number {
  //   let percent = this.ccFilters.getTotalNoPhonePercent();
  //   return percent ? percent : 0
  // }


  toggleShow(dropMenu: HTMLUListElement) {
    if (dropMenu.classList.contains('show')) {
      dropMenu.classList.remove('show')
      // this.updateTotalInfo()
    } else dropMenu.classList.add('show')
  }

  selectValue(value: DictionaryModel, kind: 'reestrStatus' | 'reestrType') {
    switch (kind) {
      case 'reestrStatus':
        if (this.isSelected(value, kind))
          this.selectedReestrStatuses = this.selectedReestrStatuses.filter(
            selectedValue => { return selectedValue.id !== value.id }
          )
        else
          this.selectedReestrStatuses.push(value)
        break

      case 'reestrType':
        if (this.isSelected(value, kind))
          this.selectedReestrTypes = this.selectedReestrTypes.filter(
            selectedValue => { return selectedValue.id !== value.id }
          )
        else
          this.selectedReestrTypes.push(value)
        break
    }
    // this.updateTotalInfo();

    this.updating = true
    setTimeout(() => { this.updateTotalInfo() })
  }

  clearChosen(clear: boolean, kind: 'reestrStatus' | 'reestrType') {
    switch (kind) {
      case 'reestrStatus':
        if (clear) this.selectedReestrStatuses = []
        else this.selectedReestrStatuses = this.reestrStatuses
        break

      case 'reestrType':
        if (clear) this.selectedReestrTypes = []
        else this.selectedReestrTypes = this.reestrTypes
        break
    }

    this.updating = true
    setTimeout(() => { this.updateTotalInfo() })
  }

  isSelected(value: DictionaryModel, kind: 'reestrStatus' | 'reestrType'): boolean {
    switch (kind) {
      case 'reestrStatus':
        for (let selectedValue of this.selectedReestrStatuses) {
          if (selectedValue.id === value.id) { return true }
        }
        return false

      case 'reestrType':
        for (let selectedValue of this.selectedReestrTypes) {
          if (selectedValue.id === value.id) { return true }
        }
        return false
    }
  }

  updateTotalInfoFromOutsideClick(dropMenu: HTMLUListElement) {
    if (dropMenu.classList.contains('show')) {
      dropMenu.classList.remove('show')
      // this.updateTotalInfo()
    }
  }

  private updateTotalInfo() {
    this.ccFilters.filterTotalData(
      this.selectedReestrTypes.map((value) => value.Name),
      this.selectedReestrStatuses.map((value) => value.Name)
    )
    let percent = this.ccFilters.getTotalNoPhonePercent()
    this.totalInfoPercent = percent ? percent : 0
    this.updating = false
  }
}
