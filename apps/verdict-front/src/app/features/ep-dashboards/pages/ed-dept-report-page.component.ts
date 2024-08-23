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
  selector: 'ed-dept-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по заміні сторони на Депт'"
      (loadData)="loadData()"
    />
  `
})
export class EdAllEpReportsdeptComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 7

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadDeptData())
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
        'Вічний СЛ',
        'ВП завершено',
        'Не набрала законної сили',
        'Набрала законної сили',
        'Не пройшло 15 днів від дати рішення',
        'Пройшло 15 днів від дати рішення',
        'Не відправлена заява про заміну ПВ',
        'Не відправлена заява про заміну ПВ більше',
        'Відправлена заява про заміну ПВ',
        'Сторона не замінена у ВП',
        'Сторона не замінена у ВП більше 7 днів',
        'Сторона не замінена у ВП більше 14 днів',
        'Сторона замінена у ВП'
      ],
      selectedIndex: ['Тип приватного виконавця', 'Куратор', 'Приватний виконавець'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Тип приватного виконавця',
        'Тип ВД',
        'Приватний виконавець',
        'Стягувач',
        'Стан ВП',
        'Група колекшн'
      ],
      selectedAggFunctions: [
        'count',
        'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'redZone', 'countNotEmpty'
      ],
      selectedAliases: [
        'К-ть',
        'Вічний СЛ',
        'ВП завершено',
        'Не набрала законної сили',
        'Набрала законної сили',
        'Не пройшло 15 днів від дати рішення',
        'Пройшло 15 днів від дати рішення',
        'Не відправлена заява про заміну ПВ',
        'Не відправлена заява про заміну ПВ більше',
        'Відправлена заява про заміну ПВ',
        'Сторона не замінена у ВП',
        'Сторона не замінена у ВП більше 7 днів',
        'Сторона не замінена у ВП більше 14 днів',
        'Сторона замінена у ВП'
      ]
    })
  }
}
