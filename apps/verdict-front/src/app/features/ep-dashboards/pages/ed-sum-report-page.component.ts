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
  selector: 'ed-sum-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Очікувана сума після реалізації з торгів'"
      (loadData)="loadData()"
    />
  `
})
export class EdSumComponent implements OnInit {
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
      selectedFilters: {
        ['Чекаємо на перерахування коштів']: ['1']
      },
      selectedValues: [
        'К-ть',
        'Кошти не перераховані більше місяця',
        'Сума реалізації майна',
        'Залишок боргу по ВЛ',
        'Сума реалізації майна з обрізкою по листу',
        '10% винагорода ПВ',
        '+/- 5% комісія',
        'Очікувана сума після реалізації майна'
      ],
      selectedIndex: ['ПВ', 'Тип лота'],
      selectedFilterKeys: [
        'Чекаємо на перерахування коштів'

      ],
      selectedAggFunctions: [
        'count', 'redZone', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum'
      ],
      selectedAliases: [
        'К-ть',
        'Кошти не перераховані більше місяця',
        'Сума реалізації майна',
        'Залишок боргу по ВЛ',
        'Сума реалізації майна з обрізкою по листу',
        '10% винагорода ПВ',
        '+/- 5% комісія',
        'Очікувана сума після реалізації майна'
      ]
    })
  }
}
