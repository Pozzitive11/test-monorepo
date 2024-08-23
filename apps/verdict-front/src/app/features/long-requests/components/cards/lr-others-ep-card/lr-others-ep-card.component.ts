import { Component, inject, Input } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { OthersEPInfoModel } from '../../../models/others-ep-info.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-others-ep-card',
  templateUrl: './lr-others-ep-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    FormatDatePipe
  ]
})
export class LrOthersEpCardComponent {
  private readonly dataService = inject(LrDataService)

  @Input() contractId!: number


  get othersEPInfo(): OthersEPInfoModel[] | undefined { return this.dataService.othersEPInfo }

  get loading() { return this.dataService.loading.othersEPInfoModel }

  ngOnInit(): void {
    this.dataService.getOthersEPInfoModel(this.contractId)
  }

}
