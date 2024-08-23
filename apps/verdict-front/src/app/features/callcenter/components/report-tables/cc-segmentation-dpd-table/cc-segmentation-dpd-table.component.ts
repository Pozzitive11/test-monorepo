import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SegmentationBucketTableModel } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcSegmentationService } from '../../../services/cc-segmentation.service'
import { sortType } from '../../../abstract-classes/segmentation-table-sort.class'
import { SegmentationBucketTable } from '../../../abstract-classes/segmentation-bucket-table.class'
import { BucketPipePipe } from '../../../pipes/bucket-pipe.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-cc-segmentation-dpd-table',
  templateUrl: './cc-segmentation-dpd-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    DecimalPipe,
    BucketPipePipe
  ]
})
export class CcSegmentationDpdTableComponent extends SegmentationBucketTable implements OnInit, OnDestroy {
  private segmentationDataService = inject(CcSegmentationService)

  header = [
    'Проєкт',
    'Наявність актуального телефону',
    'Бакет DPD',

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
    'Бакет DPD'
  ]
  sortTypes: sortType[] = []

  reportData: SegmentationBucketTableModel[] = []
  shownData: SegmentationBucketTableModel[] = []
  reportData$: Subscription | undefined

  constructor() { super() }

  ngOnInit(): void {
    this.fillSorting()
    this.reportData$ = this.segmentationDataService.dpdReport
      .subscribe((report) => {
        this.reportData = report
        this.fillSorting()
        this.updateShownData()
      })
  }

  ngOnDestroy(): void {
    this.reportData$?.unsubscribe()
  }

}
