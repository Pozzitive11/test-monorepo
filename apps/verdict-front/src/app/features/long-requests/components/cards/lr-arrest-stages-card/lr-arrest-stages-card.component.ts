import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { ArrestStagesModel } from '../../../models/arrest-stages.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-arrest-stages-card',
  templateUrl: './lr-arrest-stages-card.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, NgFor, FormatDatePipe]
})
export class LrArrestStagesCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN?: string
  @Input() contractId!: number

  get arrestStagesInfo(): ArrestStagesModel[] | undefined { return this.dataService.arrestStagesInfo }

  get loading() { return this.dataService.loading.arrestStagesInfo }

  ngOnInit(): void {
    this.dataService.getArrestStagesInfo(this.contractId, this.INN)
  }

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }
}
