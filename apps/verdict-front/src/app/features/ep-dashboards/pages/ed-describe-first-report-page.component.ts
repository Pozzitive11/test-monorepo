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
  selector: 'ed-describe-first-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Черга майна на опрацювання'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeFirstComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadFirstData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'К-ть майна',
        'Не підконтрольна територія',
        'Підконтрольна територія',
        'Сума ВП менша 30 тис.',
        'Сума ВП від 30 тис.',
        'Платна перевірка відсутня',
        'Платна перевірка наявна',
        'Виписка не загружена',
        'Виписка завантажена',
        'Власни не підтвердився',
        'Власник підтвердився',
        'Описано',
        'Не описано',
        'Є іпотека',
        'Не опрацьовано',
        'Опрацьовано'
      ],
      selectedIndex: ['Тип майна', 'Підтип майна'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Актуальний ПВ',
        'Тип ВД',
        'Приватний виконавець',
        'Стягувач',
        'Стан ВП',
        'Група колекшн',
        'СЛ Категория',
        'Статус по опрацюванню',
        'Опрацьовано',
        'Тип майна'
      ],
      selectedButtonFiltersKeys: [
        'Черга майна на опрацювання по написам',
        'Черга майна на опрацювання по листам'
      ],
      selectedAggFunctions: [
        'count',
        'sum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'redZoneSum', 'sum', 'sum', 'sum', 'sum', 'redZoneSum', 'sum', 'redZoneSum', 'sum'
      ],
      selectedAliases: [
        'К-ть майна',
        'Не підконтрольна територія',
        'Підконтрольна територія',
        'Сума ВП менша 30 тис.',
        'Сума ВП від 30 тис.',
        'Платна перевірка відсутня',
        'Платна перевірка наявна',
        'Виписка не загружена',
        'Виписка завантажена',
        'Власни не підтвердився',
        'Власник підтвердився',
        'Описано',
        'Не описано',
        'Є іпотека',
        'Не опрацьовано',
        'Опрацьовано'
      ]
    })
  }
}
