import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { MegaSolvencyModel } from '../../../models/mega-solvency.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-crossing-the-borders-card',
  templateUrl: './lr-crossing-the-borders-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    FormatDatePipe
  ]
})
export class LrCrossingTheBordersCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN!: string
  @Input() contractId!: number

  get crossingTheBorders(): MegaSolvencyModel | undefined {
    return this.dataService.guarantors[this.INN].CrossingTheBorders
  }

  get loading() { return this.dataService.loading.crossingTheBorders }

  ngOnInit(): void {
    this.dataService.getCrossingTheBordersInfo(this.contractId, this.INN)
  }

  checkPresent() {
    return this.crossingTheBorders && this.crossingTheBorders.CrossingInfo.length
  }
}
