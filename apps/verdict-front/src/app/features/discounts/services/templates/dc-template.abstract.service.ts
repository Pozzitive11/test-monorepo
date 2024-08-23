import { computed, inject, Injectable, signal } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import * as shevchenko from 'shevchenko'
import { AsyncErrorModel } from '../../../../shared/models/error.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { roundNumber } from '../../../../shared/utils/math.util'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { dctTypesShortEnum } from '../../models/dc-template-models/dct-types.enum'
import { DEBT_CATEGORIES, determineDebtType } from '../../utils/debt-categories'
import { DcHttpService } from '../dc-http.service'
import { DctAbstarctInputDataModel } from '../../models/dc-template-models/dct-abstract-input-data.model'
import { DctAbstractDataModel } from '../../models/dc-template-models/dct-abstract.data.model'


@Injectable({
  providedIn: 'root'
})
export class DcTemplateAbstractContractService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)

  inputAbstractData = signal<DctAbstarctInputDataModel[]>([])
  abstractData = signal<DctAbstractDataModel[]>([])
  abstractFailedDocLoads = computed(() => {
    return this.abstractData()
      .filter(template => template.fileBlob === undefined)
      .map(template => template.PromotionId)
  })

  loading$ = new BehaviorSubject<boolean>(false)


  createAbstractTemplates(data: { [p: string]: any }[]) {
    /*
    * Створює нові моделі DcInputWritingOffData для inputWritingOffData з даних таблиці ДС/РС
    *
    * @param data - обрані дані для створення моделей (з таблиці ДС/РС)
     */

    this.inputAbstractData.set([])
    if (data.length === 0)
      return

    this.inputAbstractData.set(data.map(row => this.abstractDataFromRow(row)))
  }

  fillAbstractTemplatesData() {
    /* Заповнює дані шаблонів з сервера */

    if (this.inputAbstractData().length === 0)
      return

    this.loading$.next(true)
    this.httpService.fillAbstractTemplateData(this.inputAbstractData())
      .subscribe({
        next: async (data: DctAbstractDataModel[]) => {
          for (const template of data) {
            const nameInCase = await this.createClientNameInCase(template)
            template.ClientNameInCase = `${nameInCase.familyName} ${nameInCase.givenName} ${nameInCase.patronymicName}`
              .replace(/\s+/g, ' ')
          }

          this.abstractData.set(data)
        },
        error: (err) => {
          this.messageService.sendError(err.error.detail)
          this.loading$.next(false)
        },
        complete: () => this.loading$.next(false)
      })
  }

  buildTemplate(template: DctAbstractDataModel) {
    /* Створює файл шаблону із даних шаблону */

    this.loading$.next(true)

    this.httpService.buildTemplate(template, dctTypesShortEnum.ABSTRACT)
      .subscribe({
        next: (res) => {
          try {
            const [fileBlob, fileBlobName] = UtilFunctions.fileFromHttpToBlob(res, true)
            this.abstractData.update(data => {
              const index = data.findIndex(t => t.PromotionId === template.PromotionId)
              data[index].fileBlob = fileBlob
              data[index].fileBlobName = fileBlobName || null
              data[index].fileLoaded = true
              return data
            })
          } catch (e) {
            this.messageService.sendError(`Виникла помилка: ${e}`)
          }
        },
        error: async (error: AsyncErrorModel) => {
          this.loading$.next(false)
          await this.messageService.alertFileError(error)
        },
        complete: () => this.loading$.next(false)
      })
  }

  saveAbstractTemplates() {

    if (this.abstractData().length === 0)
      return null

    return this.httpService.saveAbstractTemplates(this.abstractData())
  }

  deleteTemplate(id: number) {


    this.inputAbstractData.set(this.inputAbstractData().filter(t => t.PromotionId !== id))
    this.abstractData.set(this.abstractData().filter(t => t.PromotionId !== id))
  }

  private abstractDataFromRow(row: { [p: string]: any }): DctAbstarctInputDataModel {


    return {
      PromotionId: row['id'],
      debtType: DEBT_CATEGORIES[row['Категорія']] || determineDebtType(row),
      projectName: row['Назва проєкту'],
      bank: row['БАНК'],
      entryDate: row['Дата внесення'],
      agreement: row['Наявність узгодження'],
      projectManager: row['ПМ'],
      contractId: row['Системний номер договору'],
      clientName: row['ПІБ'],
      promotionType: row['Довідник акцій'],
      clientINN: row['ІПН клієнта'],
      currentDebt: row['Сума боргу на момент подачі'],

      debt: row['Сума в Угоді'],
      body: row['Сума в Угоді (тіло)'],
      percents: row['Сума в Угоді (відсотки)'],
      commission: row['Сума в Угоді (комісія)'],
      fine: row['Сума в Угоді (пеня)'],
      debtRule: row['Пункт правила'],

      epState: row['Стан ВП'],

      sumToPay: roundNumber(row['Сума до сплати']),
      restructuring: row['Кількість місяців по РС']
    }
  }

  async createClientNameInCase(prom: DctAbstractDataModel) {
    const input: shevchenko.DeclensionInput = {
      gender: ['W', 'Ж'].includes(prom.ClientSex || '') ?
        shevchenko.GrammaticalGender.FEMININE : shevchenko.GrammaticalGender.MASCULINE,
      givenName: prom.ClientFirstName || '',
      patronymicName: prom.ClientMiddleName || '',
      familyName: prom.ClientLastName || ''
    }

    return await shevchenko.inAblative(input)
  }

}
