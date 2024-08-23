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
  selector: 'ed-actually-reasons-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Причини завершення ВП'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeActuallyReasonsComponent implements OnInit {
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
      selectedFilters: {
        ['Звіт по фактично виконаним']: ['1']
      },
      selectedValues: [
        'К-ть',
        'Причина завершення невідома',
        'Відсутній ідентифікатор',
        'Причина завершення невідома більше місяця'
      ],
      selectedIndex: ['Причина завершення'],
      selectedFilterKeys: [
        'Звіт по фактично виконаним',
        'Причина завершення'
      ],
      selectedAggFunctions: [
        'count', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty'
      ],
      selectedAliases: [
        'К-ть',
        'Причина завершення невідома',
        'Відсутній ідентифікатор',
        'Причина завершення невідома більше місяця'
      ]
    })
  }
}
