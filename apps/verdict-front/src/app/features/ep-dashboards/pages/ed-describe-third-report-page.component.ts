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
  selector: 'ed-describe-third-report-page',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Черга на опис нерухомості ПВ'"
      (loadData)="loadData()"
    />
  `
})
export class EdDescribeThirdComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 0

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
        'К-ть',
        'К-ть землі',
        'Зроблено запит в ДЗК',
        'Запит в ДЗК відсутній більше 2 тижнів',
        'Відповідь з ДЗК негативна',
        'Відповідь з ДЗК позитивна',
        'Відповідь з ДЗК відсутня більше 2 тижнів',
        'К-ть житлової нерухомості',
        'Зроблено запит в ЦНАП(житлова)',
        'Запит в ЦНАТ відсутній більше 2 тижнів(житлова)',
        'Відповідь з ЦНАП негативна(житлова)',
        'Відповідь з ЦНАП позитивна(житлова)',
        'Відповідь з ЦНАП відсутня більше 2 тижнів(житлова)',
        'Зроблено запит в БТІ(житлова)',
        'Запит в БТІ відсутній більше 2 тижнів(житлова)',
        'Відповідь з БТІ негативна(житлова)',
        'Відповідь з БТІ позитивна(житлова)',
        'Відповідь з БТІ відсутня більше 2 тижнів(житлова)',
        'К-ть нежитлової нерухомості',
        'Зроблено запит в БТІ(Нежитлова)',
        'Запит в БТІ відсутній більше 2 тижнів(Нежитлова)',
        'Відповідь з БТІ негативна(Нежитлова)',
        'Відповідь з БТІ позитивна(Нежитлова)',
        'Відповідь з БТІ відсутня більше 2 тижнів(Нежитлова)'
      ],
      selectedIndex: ['Приватний виконавець'],
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
        'Опрацьвано',
        'Тип Майна'
      ],
      selectedButtonFiltersKeys: [
        'Черга на опис нерухомості по написам',
        'Черга на опис нерухомості по листам'
      ],
      selectedAggFunctions: [
        'count',
        'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone'
      ],
      selectedAliases: [
        'К-ть',
        'К-ть землі',
        'Зроблено запит в ДЗК',
        'Запит в ДЗК відсутній більше 2 тижнів',
        'Відповідь з ДЗК негативна',
        'Відповідь з ДЗК позитивна',
        'Відповідь з ДЗК відсутня більше 2 тижнів',
        'К-ть житлової нерухомості',
        'Зроблено запит в ЦНАП(житлова)',
        'Запит в ЦНАТ відсутній більше 2 тижнів(житлова)',
        'Відповідь з ЦНАП негативна(житлова)',
        'Відповідь з ЦНАП позитивна(житлова)',
        'Відповідь з ЦНАП відсутня більше 2 тижнів(житлова)',
        'Зроблено запит в БТІ(житлова)',
        'Запит в БТІ відсутній більше 2 тижнів(житлова)',
        'Відповідь з БТІ негативна(житлова)',
        'Відповідь з БТІ позитивна(житлова)',
        'Відповідь з БТІ відсутня більше 2 тижнів(житлова)',
        'К-ть нежитлової нерухомості',
        'Зроблено запит в БТІ(Нежитлова)',
        'Запит в БТІ відсутній більше 2 тижнів(Нежитлова)',
        'Відповідь з БТІ негативна(Нежитлова)',
        'Відповідь з БТІ позитивна(Нежитлова)',
        'Відповідь з БТІ відсутня більше 2 тижнів(Нежитлова)'
      ]
    })
  }
}
