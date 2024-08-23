import { Component, inject, OnInit } from '@angular/core'
import { SegmentationBucketTable } from '../../../abstract-classes/segmentation-bucket-table.class'
import { sortType } from '../../../abstract-classes/segmentation-table-sort.class'
import { SegmentationBucketTableModel } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcSegmentationService } from '../../../services/cc-segmentation.service'
import { BucketPipePipe } from '../../../pipes/bucket-pipe.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-cc-segmentation-debt-table',
  templateUrl: './cc-segmentation-debt-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    DecimalPipe,
    BucketPipePipe
  ]
})
export class CcSegmentationDebtTableComponent extends SegmentationBucketTable implements OnInit {
  private segmentationDataService = inject(CcSegmentationService)

  header = [
    'Проєкт',
    'Наявність актуального телефону',
    'Бакет суми боргу',

    'Кількість КД',
    'Кількість КД % від проєкту',
    'Тіло',
    'Outstanding',
    'Відсотки',
    'Тіло %',
    'Доля %',
    'Тіло_avg',
    'Outstanding_avg',
    'DPD_avg'
    // 'Відхилення від середнього значення НКС без телефонів',
  ]
  nonSortedColumns = [
    'Наявність актуального телефону',
    'Бакет суми боргу'
  ]

  reportData: SegmentationBucketTableModel[] = []
  reportData$: Subscription | undefined
  shownData: SegmentationBucketTableModel[] = []
  sortTypes: sortType[] = []

  constructor() { super() }

  ngOnInit(): void {
    this.fillSorting()
    this.reportData$ = this.segmentationDataService.debtReport
      .subscribe((report) => {
        this.reportData = report
        this.fillSorting()
        this.updateShownData()
      })
  }

}
