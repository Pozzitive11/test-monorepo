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
  selector: 'ed-fact-sl-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по фактично виконаним ВП для СЛ і закриття ВП'"
      (loadData)="loadData()"
    />
  `
})
export class EdFactSlComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadFactSlData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedFilters: {
        ['Угода']: ['0']
      },
      selectedValues: [
        'К-ть',
        'Потрібен ручний аналіз',
        'Відсутній СЛ',
        'Відсутній СЛ більше 2 днів',
        'Залог, СЛ не потрібен',
        'Тимчасовий СЛ але ВП погашено',
        'Наявний СЛ',
        'Наявне ВП',
        'ВП завершено',
        'ВП Відкрито',
        'Аванс не повернуто',
        'Аванс повернуто',
        'Не погоджено Аналітиком',
        'З них в роботі Силки/Юлі',
        'Погоджено Аналітиком',
        'Не погоджено відповідальним за СЛ',
        'Погоджено відповідальним за СЛ',
        'СЗ не відправлена',
        'СЗ відправлена',
        'СЗ не погоджена',
        'СЗ погоджена',
        'Заява про закриття не відправлена',
        'Заява про закриття не відправлена більше 4 днів',
        'Заява про закриття відправлена',
        'ВП не завершено',
        'ВП не завершено більше місяця'
      ],
      selectedIndex: ['Дата останнього платежу'],
      selectedFilterKeys: [
        'Угода'
      ],
      selectedAggFunctions: [
        'count', 'sum', 'sum', 'redZoneCount', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'redZoneCount', 'sum', 'redZoneCount', 'sum', 'sum', 'redZoneCount', 'sum', 'redZoneCount', 'sum', 'redZoneCount', 'sum', 'sum', 'redZone', 'sum', 'sum', 'redZone'
      ],
      selectedAliases: [
        'К-ть',
        'Потрібен ручний аналіз',
        'Відсутній СЛ',
        'Відсутній СЛ більше 2 днів',
        'Залог, СЛ не потрібен',
        'Тимчасовий СЛ але ВП погашено',
        'Наявний СЛ',
        'Наявне ВП',
        'ВП завершено',
        'ВП Відкрито',
        'Аванс не повернуто',
        'Аванс повернуто',
        'Не погоджено Аналітиком',
        'З них в роботі Силки/Юлі',
        'Погоджено Аналітиком',
        'Не погоджено відповідальним за СЛ',
        'Погоджено відповідальним за СЛ',
        'СЗ не відправлена',
        'СЗ відправлена',
        'СЗ не погоджена',
        'СЗ погоджена',
        'Заява про закриття не відправлена',
        'Заява про закриття не відправлена більше 4 днів',
        'Заява про закриття відправлена',
        'ВП не завершено',
        'ВП не завершено більше місяця'
      ]
    })
  }
}
