import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { EpDetailedInfoModel } from '../../../models/ep-detailed-info.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { NgbModal, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { LrEpDetailedInfoEditComponent } from '../../edits/lr-ep-detailed-info-edit/lr-ep-detailed-info-edit.component'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-ep-detailed-info-card',
  templateUrl: './lr-ep-detailed-info-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    NgbTooltip,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class LrEpDetailedInfoCardComponent implements OnInit {
  private dataService = inject(LrDataService)
  private modalService = inject(NgbModal)

  readonly closedEPStates: (string | undefined)[] = [
    'Завершено',
    'Зупинено'
  ]

  @Input() isRelated: boolean = false
  @Input() contractId!: number

  get epDetailedInfoList(): EpDetailedInfoModel[] | undefined { return this.isRelated ? this.dataService.epDetailedInfoRelated : this.dataService.epDetailedInfo }

  get loading() { return this.dataService.loading.epDetailedInfo }

  ngOnInit(): void {
    this.dataService.getEPDetailedInfo(this.contractId, this.isRelated)
  }

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }

  openEdit(epDetailedInfo: EpDetailedInfoModel, epIndex: number) {
    const modalRef = this.modalService.open(
      LrEpDetailedInfoEditComponent,
      {
        centered: true,
        scrollable: true,
        size: '500px'
      }
    )
    modalRef.componentInstance.epDetailedInfo = { ...epDetailedInfo }
    modalRef.result
      .then(epDetailedInfoUpdate => this.dataService.epDetailedInfo![epIndex] = epDetailedInfoUpdate)
      .catch(() => {})
  }
}
