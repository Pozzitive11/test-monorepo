import { computed, inject, Injectable, signal } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { DctInformLetterDataModel } from '../../models/dc-template-models/dct-inform-letter-data.model'
import { dctTypesShortEnum } from '../../models/dc-template-models/dct-types.enum'
import { DcHttpService } from '../dc-http.service'

@Injectable({
  providedIn: 'root'
})
export class DcTemplateInformLetterService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)

  informLetterTemplatesData = signal<DctInformLetterDataModel[]>([])
  informLetterFailedDocLoads = computed(() => {
    return this.informLetterTemplatesData()
      .filter((template) => template.fileBlob === undefined)
      .map((template) => template.PromotionId)
  })

  loading$ = new BehaviorSubject<boolean>(false)

  createInformLetterTemplates(promotionIds: number[]) {
    this.informLetterTemplatesData.set([])
    if (promotionIds.length === 0) return

    this.loading$.next(true)

    this.httpService.loadInformLetterTemplate(promotionIds).subscribe({
      next: (data: DctInformLetterDataModel[]) => {
        console.log(data)

        this.informLetterTemplatesData.set(data)
      },
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.loading$.next(false)
      },
      complete: () => this.loading$.next(false)
    })
  }

  buildInformLetterTemplate(template: DctInformLetterDataModel) {
    this.loading$.next(true)
    this.httpService.buildTemplate(template, dctTypesShortEnum.ASSIGNMENT_LETTER).subscribe({
      next: (res) => {
        try {
          const [fileBlob, fileBlobName] = UtilFunctions.fileFromHttpToBlob(res, true)
          this.informLetterTemplatesData.update((data) => {
            const index = data.findIndex((t) => t.PromotionId === template.PromotionId)
            data[index].fileBlob = fileBlob
            data[index].fileBlobName = fileBlobName || null
            data[index].fileLoaded = true
            return data
          })
        } catch (e) {
          this.messageService.sendError(`Виникла помилка: ${e}`)
        }
      },
      error: async (error: any) => {
        this.loading$.next(false)
        this.messageService.sendError(
          'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
        )
      },
      complete: () => this.loading$.next(false)
    })
  }

  deleteInformLetterTemplate(id: number) {
    this.informLetterTemplatesData.set(this.informLetterTemplatesData().filter((t) => t.PromotionId !== id))
  }

  saveInformLetters() {
    /* Сохраняет данные информ писем в БД и скачивает созданные и подтверждённые файлы */

    if (this.informLetterTemplatesData().length === 0) return null

    return this.httpService.saveInformLetters(this.informLetterTemplatesData())
  }
}
