import { computed, inject, Injectable, signal } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AsyncErrorModel } from '../../../../shared/models/error.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { dateFromString, lastDayOfCurrentMonth } from '../../../../shared/utils/dates.util'
import { roundNumber } from '../../../../shared/utils/math.util'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { DctGuaranteeLetterDataModel } from '../../models/dc-template-models/dct-guarantee-letter-data.model'
import { DctGuaranteeLetterInputDataModel } from '../../models/dc-template-models/dct-guarantee-letter-input-data.model'
import { dctTypesShortEnum } from '../../models/dc-template-models/dct-types.enum'
import { DEBT_CATEGORIES, determineDebtType } from '../../utils/debt-categories'
import { DcHttpService } from '../dc-http.service'

@Injectable({
  providedIn: 'root'
})
export class DctGuaranteeLetterService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)

  inputGuaranteeLetterData = signal<DctGuaranteeLetterInputDataModel[]>([])
  guaranteeLetterTemplatesData = signal<DctGuaranteeLetterDataModel[]>([])
  guaranteeLetterFailedDocLoads = computed(() => {
    return this.guaranteeLetterTemplatesData()
      .filter(template => template.fileBlob === undefined)
      .map(template => template.PromotionId)
  })

  loading$ = new BehaviorSubject<boolean>(false)

  createGuaranteeLetterTemplates(data: { [p: string]: any }[]) {
    /*
    * Створює нові моделі DctGuaranteeLetterInputData для guaranteeLetterInputData з даних таблиці ДС/РС
    *
    * @param data - обрані дані для створення моделей (з таблиці ДС/РС)
    *
    */
    this.inputGuaranteeLetterData.set([])
    if (data.length === 0)
      return

    this.inputGuaranteeLetterData.set(data.map(row => this.guaranteeLetterDataFromRow(row)))
  }

  fillGuaranteeLetterTemplates() {
    /* Заповнює дані шаблонів з сервера */
    this.guaranteeLetterTemplatesData.set([])
    if (this.inputGuaranteeLetterData().length === 0)
      return

    this.loading$.next(true)

    this.httpService.fillGuaranteeLetterTemplateData(this.inputGuaranteeLetterData())
      .subscribe({
        next: (data: DctGuaranteeLetterDataModel[]) => this.guaranteeLetterTemplatesData.set(data),
        error: async (err) => {
          await this.messageService.alertError(err)
          this.loading$.next(false)
        },
        complete: () => this.loading$.next(false)
      })
  }

  buildTemplate(template: DctGuaranteeLetterDataModel) {
    /* Створює шаблон гарантійного листа */

    this.httpService.buildTemplate(template, dctTypesShortEnum.GUARANTEE_LETTER)
      .subscribe({
        next: (res) => {
          try {
            const [fileBlob, fileBlobName] = UtilFunctions.fileFromHttpToBlob(res, true)
            this.guaranteeLetterTemplatesData.update(data => {
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

  saveGuaranteeLetters() {
    /* Зберігає шаблони гарантійних листів на сервері */

    if (this.guaranteeLetterTemplatesData().length === 0)
      return null

    return this.httpService.saveGuaranteeLetters(this.guaranteeLetterTemplatesData())
  }

  deleteTemplate(id: number) {
    /* Видаляє шаблон гарантійного листа зі списку */

    this.inputGuaranteeLetterData.set(this.inputGuaranteeLetterData().filter(t => t.PromotionId !== id))
    this.guaranteeLetterTemplatesData.set(this.guaranteeLetterTemplatesData().filter(t => t.PromotionId !== id))
  }

  private guaranteeLetterDataFromRow(row: { [p: string]: any }): DctGuaranteeLetterInputDataModel {
    const paymentDateLimit = (
      row['Гранична дата по узгодженню'] ?
        dateFromString(row['Гранична дата по узгодженню'], false, '%d.%m.%Y')
        : lastDayOfCurrentMonth()
    )
    return {
      PromotionId: row['id'],
      PaymentDateLimit: paymentDateLimit ? UtilFunctions.formatDate(paymentDateLimit, false, '%Y-%m-%d') : null,
      currentDebt: row['Сума боргу на момент подачі'],
      SumToClose: row['Сума в Угоді'],
      SumToPay: roundNumber(row['Сума до сплати']),
      debtType: DEBT_CATEGORIES[row['Категорія']] || determineDebtType(row),
      epState: row['Стан ВП'],
      confirmed: false,
      contractId: row['Системний номер договору'],
      clientName: row['ПІБ'],
      clientINN: row['ІПН клієнта'],
      debtRule: row['Пункт правила']
    }
  }
}
