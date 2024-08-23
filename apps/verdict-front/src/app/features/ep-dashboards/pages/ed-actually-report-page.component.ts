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
  selector: 'ed-actually-report-page',
  standalone: true,
  imports: [
    EpPivotReportComponent
  ],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по фактично виконаним ВП'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeActuallyComponent implements OnInit {
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
        'Причина завершення невідома',
        'Відсутній ідентифікатор',
        'Причина завершення невідома більше місяця',
        'Причина завершення відома',
        'К-ть ВП більше 1 потрібен ручний аналіз',
        'К-ть ВП(1 вп - 1 нкс)',
        'К-ть ВП по яким залишок боргу відсутній',
        'К-ть ВП по яким залишок боргу наявний',
        'К-ть ВП по яким стоїть вічний СЛ',
        'К-ть ВП по яким відсутній вічний СЛ',
        'К-ть ВП по яким дата завершення менша 14 днів',
        'К-ть ВП по яким дата завершення більше 14 днів',
        'К-ть ВП по яким дата завершення після 1 жовтня',
        'Сума недоплати по ВП які завершились після 1 жовтня',
        'К-ть ВП по яким дата завершення після 1 жовтня більше 28 днів',
        'Сума недоплати по ВП які завершились після 1 жовтня більше 28 днів',
        'К-ть ВП по яким дата завершення до 1 жовтня',
        'Сума недоплати',
        'К-ть ВП по яким відсутні платежі з дати відкриття ВП',
        'Відсутні платежі з дати відкриття ВП',
        'К-ть ВП по яким наявні платежі з дати відкриття ВП',
        'Наявні платежі з дати відкриття ВП',
        'К-ть ВП по яким залишок боргу менше 10 тис.',
        'Залишок боргу по ВП менше 10 тис.',
        'К-ть ВП по яким залишок боргу більше 10 тис.',
        'Залишок боргу по ВП більше 10 тис.'
      ],
      selectedIndex: ['Причина завершення', 'Куратор', 'Приватний виконавець'],
      selectedFilterKeys: [
        'Звіт по фактично виконаним',
        'Причина завершення'
      ],
      selectedAggFunctions: [
        'sum', 'sum', 'redZoneSum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'redZoneSum', 'redZoneSum', 'sum', 'sum', 'redZoneSum', 'redZoneSum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'redZoneSum'
      ],
      selectedAliases: [
        'Причина завершення невідома',
        'Відсутній ідентифікатор',
        'Причина завершення невідома більше місяця ',
        'Причина завершення відома',
        'К-ть ВП більше 1 потрібен ручний аналіз',
        'К-ть ВП(1 вп - 1 нкс)',
        'К-ть ВП по яким залишок боргу відсутній',
        'К-ть ВП по яким залишок боргу наявний',
        'К-ть ВП по яким стоїть вічний СЛ',
        'К-ть ВП по яким відсутній вічний СЛ',
        'К-ть ВП по яким дата завершення менша 14 днів',
        'К-ть ВП по яким дата завершення більше 14 днів',
        'К-ть ВП по яким дата завершення після 1 жовтня',
        'Сума недоплати по ВП які завершились після 1 жовтня',
        'К-ть ВП по яким дата завершення після 1 жовтня більше 28 днів',
        'Сума недоплати по ВП які завершились після 1 жовтня більше 28 днів',
        'К-ть ВП по яким дата завершення до 1 жовтня',
        'Сума недоплати',
        'К-ть ВП по яким відсутні платежі з дати відкриття ВП',
        'Відсутні платежі з дати відкриття ВП',
        'К-ть ВП по яким наявні платежі з дати відкриття ВП',
        'Наявні платежі з дати відкриття ВП',
        'К-ть ВП по яким залишок боргу менше 10 тис.',
        'Залишок боргу по ВП менше 10 тис.',
        'К-ть ВП по яким залишок боргу більше 10 тис.',
        'Залишок боргу по ВП більше 10 тис.'
      ]
    })
  }
}
