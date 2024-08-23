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
  selector: 'ed-wp-dept-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Платежі після заміни у ВП на Дебт'"
      (loadData)="loadData()"
    />
  `
})
export class EdWpDeptComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadWpData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedFilters: {
        ['Компанія на яку зайшли кошти']: ['ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ ДЕБТ ФОРС']
      },
      selectedValues: [
        'К-ть платежів',
        'Сума платежів'
      ],
      selectedIndex: ['Тип ВД', 'Тип контрагента наш', 'Імя контрагента'],
      selectedFilterKeys: [
        'Тип ВД',
        'Приватний виконавець',
        'Компанія на яку зайшли кошти'

      ],
      selectedAggFunctions: [
        'count', 'sum'
      ],
      selectedAliases: [
        'К-ть платежів',
        'Сума платежів'
      ]
    })
  }
}
