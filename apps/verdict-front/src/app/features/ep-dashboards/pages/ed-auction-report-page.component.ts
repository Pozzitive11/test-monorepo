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
  selector: 'ed-auction-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по торгам'"
      (loadData)="loadData()"
    />
  `
})
export class EdAuctionReportPageComponent implements OnInit {
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
      selectedValues: [
        'К-ть',
        'Зупинено реалізацію',
        'Припинено реалізацію (негативні підстави)',
        'Акт опису готовий',
        'Акт опису відсутній',
        'Акт опису відсутній більше',
        'Подано заяву про призначення оцінщика',
        'Не подано заяву про призначення оцінщика',
        'Не подано заяву про призначення оцінщика більше',
        'Наявна постанова про призначення оцінщика',
        'Відсутня постанова про призначення оцінщика',
        'Відсутня постанова про призначення оцінщика більше',
        'Оцінка готова',
        'Оцінка не готова',
        'Оцінка відсутня більше',
        'Торги призначено',
        'Торги не призначено',
        'Торги не призначено більше',
        'Торги призначено в майбутньому',
        'Торги відбулися',
        'Чекаємо на перерахування коштів',
        'Кошти не перераховані більше місяця',
        'Кошти отримані',
        'Майно знаходиться на тимчасово окупованій території',
        'Результат торгів невідомий',
        'Торги не відбулися',
        'Рішення щодо прийняття у власність відсутнє',
        'Рішення щодо прийняття у власність не прийнято',
        'Повторне коло',
        'Приймаємо у власність',
        'Прийнято у власність'
      ],
      selectedIndex: ['ПВ'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Активний ПВ',
        'Тип ВД',
        'ПВ',
        'Стягувач',
        'Стан ВП',
        'Тип лота 2'
      ],
      selectedButtonFiltersKeys: [
        'Торги без іпотеки по листам',
        'Торги без іпотеки по написам'
      ],
      selectedAggFunctions: [
        'count',
        'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty'
      ],
      selectedAliases: [
        'К-ть',
        'Зупинено реалізацію',
        'Припинено реалізацію (негативні підстави)',
        'Акт опису готовий',
        'Акт опису відсутній',
        `Акт опису відсутній більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Подано заяву про призначення оцінщика',
        'Не подано заяву про призначення оцінщика',
        `Не подано заяву про призначення оцінщика більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Наявна постанова про призначення оцінщика',
        'Відсутня постанова про призначення оцінщика',
        `Відсутня постанова про призначення оцінщика більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Оцінка готова',
        'Оцінка не готова',
        `Оцінка відсутня більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Торги призначено',
        'Торги не призначено',
        `Торги не призначено більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Торги призначено в майбутньому',
        'Торги відбулися',
        'Чекаємо на перерахування коштів',
        'Кошти не перераховані більше місяця',
        'Кошти отримані',
        'Майно знаходиться на тимчасово окупованій території',
        'Результат торгів невідомий',
        'Торги не відбулися',
        'Рішення щодо прийняття у власність відсутнє',
        'Рішення щодо прийняття у власність не прийнято',
        'Повторне коло',
        'Приймаємо у власність',
        'Прийнято у власність'
      ]
    })
  }
}
