import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { PivotTableService } from '../../../shared/components/pivot-table/pivot-table.service'
import {
  complexAggFunctionDescriptions,
  complexAggFunctionFactory,
  complexAggFunctionFilterFunctions
} from '../../../shared/components/pivot-table/utils/aggregation.functions'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { EdHttpService } from '../services/ed-http.service'
import { EpPivotReportComponent } from '../components/ep-pivot-report/ep-pivot-report.component'


@Component({
  selector: 'ed-report-dfs',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по перепровірці ДФС'"
      (loadData)="loadData()"
    />
  `
})
export class EdAllEpReportsdfsComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadDfsData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'К-ть на перепровірку',
        'ВП завершено',
        'ВП зупинено',
        'Є вічний СЛ',
        'Сума ВП погашена',
        'Є платежі протягом останніх 3 місяців',
        'Відсутній запит в ДФС/ПФУ',
        'Відсутність запит в ДФС більше',
        'Зробили новий запит ДФС/ПФУ',
        'Невідома відповідь з ДФС',
        'Позитивна відповідь з ДФС',
        'Негативна відповідь з ДФС',
        'Виявлено нову роботу(роботи)',
        'Винесли нову постанову на ЗП',
        'Відсутня постанова на ЗП',
        'Відсутня постанова на ЗП більше',
        'Підтвердилась стара робота',
        'Відправили лист повідомлення на стару роботу',
        'Не відправили лист повідомлення на стару роботу',
        'Не відправили лист повідомлення на стару роботу більше',
        'Наявний арешт коштів',
        'Відсутній арешт коштів',
        'Відсутній арешт коштів по ВНН',
        'Відсутній арешт коштів по ВНН більше',
        'Відсутній арешт коштів по ВЛ',
        'Відсутній арешт коштів по ВЛ більше'
      ],
      selectedIndex: ['Куратор', 'Приватний виконавець'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Актуальний ПВ',
        'Тип ВД',
        'Приватний виконавець для звіту',
        'Стягувач',
        'Стан ВП',
        'Група колекшн'
      ],
      selectedAggFunctions: [
        'count',
        'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'redZone'
      ],
      selectedAliases: [
        'К-ть на перепровірку',
        'ВП завершено',
        'ВП зупинено',
        'Є вічний СЛ',
        'Сума ВП погашена',
        'Є платежі протягом останніх 3 місяців',
        'Відсутній запит в ДФС/ПФУ',
        `Відсутність запит в ДФС більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Зробили новий запит ДФС/ПФУ',
        'Невідома відповідь з ДФС',
        'Позитивна відповідь з ДФС',
        'Негативна відповідь з ДФС',
        'Виявлено нову роботу(роботи)',
        'Винесли нову постанову на ЗП',
        'Відсутня постанова на ЗП',
        `Відсутня постанова на ЗП більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Підтвердилась стара робота',
        'Відправили лист повідомлення на стару роботу',
        'Не відправили лист повідомлення на стару роботу',
        `Не відправили лист повідомлення на стару роботу більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Наявний арешт коштів',
        'Відсутній арешт коштів',
        'Відсутній арешт коштів по ВНН',
        `Відсутній арешт коштів по ВНН більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Відсутній арешт коштів по ВЛ',
        `Відсутній арешт коштів по ВЛ більше ${UtilFunctions.daysToString(this.redZoneDays)}`
      ]
    })
  }
}
