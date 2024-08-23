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
  selector: 'ed-all-ep-reports-wp',
  standalone: true,
  imports: [EpPivotReportComponent],
  template: `
    <app-ep-pivot-report
      [reportName]="'Звіт по ВП наших компаній'"
      (loadData)="loadData()"
    />
  `
})
export class EdAllEpReportsWpComponent implements OnInit {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly httpService = inject(EdHttpService)

  redZoneDays: number = 14

  ngOnInit(): void {
    this.pivotTableService.resetPivotTable()
  }

  loadData() {
    this.loadPreset()
    this.pivotTableService.loadData(this.httpService.loadAllEpWpData())
  }

  private loadPreset() {
    this.pivotTableService.resetAggFunctions({
      aggFunctions: { 'redZone': complexAggFunctionFactory.redZone(this.redZoneDays) },
      aggFunctionsDescriptions: { 'redZone': complexAggFunctionDescriptions.redZone },
      aggFunctionsReverse: { 'redZone': complexAggFunctionFilterFunctions.redZone(this.redZoneDays) }
    })

    this.pivotTableService.setPivotConfig({
      selectedValues: [
        'К-ть ВП',
        'Зареєстрований',
        'Відкриті ВП',
        'Не відкриті ВП',
        'Не відкрито більше',
        'Наявність ідентификатора',
        'Відсутність ідентифікатора',
        'Відсутність ідентифікаторів більше',
        'Отримана відповідь з ДФС',
        'Відсутність відповіді з ДФС',
        'Відсутність відповіді з ДФС більше',
        'Позитивна відповідь з ДФС',
        'Негативна відповідь з ДФС',
        'Невідома відповідь з ДФС',
        'Постанова перевірена і наявна',
        'Відсутність постанов (від позитивних відповідей з ДФС)',
        'Негативна відповідь ПФУ',
        'Зупинено',
        'Відсутність постанов (з врахуванням негативних відповідей ПФУ і Зупинено)',
        'Немає постанови більше',
        'Наявний арешт',
        'Відсутній арешт коштів',
        'Арешту не буде по об`єктивним причинам',
        'Арешт наявний по ІПН',
        'Відсутній арешт коштів по ВП на суму більше 100 тис.',
        'Відсутній арешт коштів з врахуванням обєктивних причин і арешту по ІПН',
        'Відсутній арешт коштів по ВНН',
        'Відсутній арешт коштів по ВНН більше',
        'Відсутній арешт коштів по ВЛ',
        'Відсутній арешт коштів по ВЛ більше',
        'Отримана відповідь з МВС',
        'Відсутність відповіді з МВС',
        'Відсутність відповіді з МВС більше',
        'Позитивний результат з МВС',
        'Постанова на розшук майна наявна',
        'Постанови на розшук майна не буде по обєктивним причинам ',
        'Відсутність постанови про розшук майна',
        'Відсутність постанови про розшук майна більше'
      ],
      selectedIndex: ['Куратор', 'Приватний виконавець'],
      selectedFilterKeys: [
        'Актуальний реєстр',
        'Актуальний ПВ',
        'Тип ВД',
        'Приватний виконавець для звіту',
        'Стягувач',
        'Стан ВП',
        'Група колекшн',
        'Вид сводної',
        'Пріоритетні справи'
      ],
      selectedButtonFiltersKeys: [
        'Відкриті ВП по активним ПВ Пріоритетні справи',
        'Відкриті ВП по активним ПВ Непріоритетні справи',
        'Відкриті ВП по неактивним ПВ',
        'Відкриті ВП по ДВС',
        'Відкриті ВП де не замінено сторону'
      ],
      selectedAggFunctions: [
        'count',
        'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'redZone', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'countNotEmpty', 'redZone'
      ],
      selectedAliases: [
        'К-ть ВП',
        'Зареєстрований',
        'Відкриті ВП',
        'Не відкриті ВП',
        `Не відкрито більше  ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Наявність ідентификатора',
        'Відсутність ідентифікатора',
        `Відсутність ідентифікаторів більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Отримана відповідь з ДФС',
        'Відсутність відповіді з ДФС',
        `Відсутність відповіді з ДФС більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Позитивна відповідь з ДФС',
        'Негативна відповідь з ДФС',
        'Невідома відповідь з ДФС',
        'Постанова перевірена і наявна',
        'Відсутність постанов (від позитивних відповідей з ДФС)',
        'Негативна відповідь ПФУ',
        'Зупинено',
        'Відсутність постанов (з врахуванням негативних відповідей ПФУ і Зупинено)',
        `Немає постанови більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Наявний арешт',
        'Відсутній арешт коштів',
        'Арешту не буде по об`єктивним причинам',
        'Арешт наявний по ІПН',
        'Відсутній арешт коштів по ВП на суму більше 100 тис.',
        'Відсутній арешт коштів з врахуванням обєктивних причин і арешту по ІПН',
        'Відсутній арешт коштів по ВНН',
        `Відсутній арешт коштів по ВНН більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Відсутній арешт коштів по ВЛ',
        `Відсутній арешт коштів по ВЛ більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Отримана відповідь з МВС',
        'Відсутність відповіді з МВС',
        `Відсутність відповіді з МВС більше ${UtilFunctions.daysToString(this.redZoneDays)}`,
        'Позитивний результат з МВС',
        'Постанова на розшук майна наявна',
        'Постанови на розшук майна не буде по обєктивним причинам ',
        'Відсутність постанови про розшук майна',
        `Відсутність постанови про розшук майна більше ${UtilFunctions.daysToString(this.redZoneDays)}`
      ]
    })
  }
}
