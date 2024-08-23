import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { MvsStagesModel } from '../../../models/mvs-stages.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-mvs-stages-card',
  templateUrl: './lr-mvs-stages-card.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, NgFor, FormatDatePipe]
})
export class LrMvsStagesCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN?: string
  @Input() contractId!: number

  get mvsStagesInfo(): MvsStagesModel[] | undefined { return this.dataService.mvsStagesInfo }

  get loading() { return this.dataService.loading.mvsStagesInfo }

  ngOnInit(): void {
    this.dataService.getMVSStagesInfo(this.contractId, this.INN)
  }

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }
}
