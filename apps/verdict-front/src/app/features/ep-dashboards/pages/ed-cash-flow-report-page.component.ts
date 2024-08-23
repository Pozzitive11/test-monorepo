import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { PivotTableService } from '../../../shared/components/pivot-table/pivot-table.service'
import {
  complexAggFunctionDescriptions,
  complexAggFunctionFactory,
  complexAggFunctionFilterFunctions
} from '../../../shared/components/pivot-table/utils/aggregation.functions'
import { EdHttpService } from '../services/ed-http.service'
import { EpPivotReportComponent } from '../components/ep-pivot-report/ep-pivot-report.component'


@Component({
  selector: 'ed-cash-flow-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Cash flow по торгам'"
      (loadData)="loadData()"
    />
  `
})
export class EdCashFlowComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadAuctionData())
  }


  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      // selectedFilters: { 'Вид сводної': ['Активний ПВ'] },
      selectedValues: [
        'К-ть',
        'Сума оцінки в грн',
        'Залишок боргу по ВЛ',
        'Сума з обрізкою по листу',
        'К-ть ВД',
        `Сума з обрізкою по листу`,
        'Залишок боргу по ВЛ'
      ],
      selectedIndex: ['Тип лота'],
      selectedFilterKeys: [
        'Місяць опису'
      ],
      selectedButtonFiltersKeys: [],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'sum', 'sum', 'avg', 'avg'
      ],
      selectedAliases: [
        'К-ть',
        'Сума оцінки в грн',
        'Залишок боргу по ВЛ',
        'Сума з обрізкою по листу',
        'К-ть ВД',
        `Середня сума на об'єкт, грн.`,
        'Середня сума листа, грн.'
      ]
    })
  }
}
