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
  selector: 'ed-actually-curator-report-page',
  standalone: true,
  imports: [
    EpPivotReportComponent
  ],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по опрацюванню фактично виконаних ВП кураторами'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeActuallyCuratorComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 0

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadActuallyData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'Відсутні платежі з дати відкриття ВП',
        'Залишок боргу по ВП більше 10 тис.'
      ],
      selectedIndex: ['Причина завершення', 'Тип ВД', 'Статус опрацювання кураторм'],
      selectedFilterKeys: [
        'Звіт по фактично виконаним',
        'Причина завершення'
      ],
      selectedAggFunctions: [
        'sum', 'sum'
      ],
      selectedAliases: [
        'Відсутні платежі з дати відкриття ВП',
        'Залишок боргу по ВП більше 10 тис.'
      ],
      selectedFilters: {
        'Звіт по фактично виконаним': ['1']
      }
    })
  }
}
