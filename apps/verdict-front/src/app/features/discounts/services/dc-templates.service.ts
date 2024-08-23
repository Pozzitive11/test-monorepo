import { BehaviorSubject, catchError, combineLatest, concatMap, from, map, Observable, reduce, scan } from 'rxjs'
import { NavigationService } from '../../../core/services/navigation.service'
import { AsyncErrorModel } from '../../../shared/models/error.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { DctTypeChooseComponent } from '../components/dc-templates/dct-type-choose/dct-type-choose.component'
import { DctBasicPromotionInfoModel } from '../models/dc-template-models/dct-basic-promotion-info.model'
import { DctDataType } from '../models/dc-template-models/dct-data.type'
import { DctRefNumberModel } from '../models/dc-template-models/dct-ref-number.model'
import { dctTypesShortEnum, dctTypesShortValues } from '../models/dc-template-models/dct-types.enum'
import { DcHttpService } from './dc-http.service'
import { DcPromotionsDataService } from './dc-promotions-data.service'
import { DcPromotionsFiltersService } from './dc-promotions-filters.service'
import { DcTemplateInformLetterService } from './templates/dc-template-inform-letter.service'
import { DcTemplateWritingOffContractService } from './templates/dc-template-writing-off-contract.service'
import { DctGuaranteeLetterService } from './templates/dct-guarantee-letter.service'
import { DcTemplateAbstractContractService } from './templates/dc-template.abstract.service'
import { HttpParams, HttpResponse } from '@angular/common/http'
import { computed, DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core'
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DcSendingDocsFiltersService } from './dc-sending-docs-filters.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class DcTemplatesService {
  private readonly modalService = inject(NgbModal)
  private readonly httpService = inject(DcHttpService)
  private readonly promotionDataService = inject(DcPromotionsDataService)

  private readonly navigationService = inject(NavigationService)
  readonly messageService = inject(MessageHandlingService)
  readonly destroyRef = inject(DestroyRef)

  private readonly promotionsDataService = inject(DcPromotionsDataService)
  private readonly promotionsFiltersService = inject(DcPromotionsFiltersService)
  private readonly sendingDocsFiltersService = inject(DcSendingDocsFiltersService)

  private readonly writingOffService = inject(DcTemplateWritingOffContractService)
  private readonly informLetterService = inject(DcTemplateInformLetterService)
  private readonly guaranteeLetterService = inject(DctGuaranteeLetterService)
  private readonly abstractService = inject(DcTemplateAbstractContractService)

  readonly templateTypes: dctTypesShortValues[] = Object.values(dctTypesShortEnum)

  canCreateRepeatedTemplate = signal(true)
  currentStep = signal(0)
  refNumberCompanies = signal<string[]>([])
  selectedRefNumberCompanies = signal<string[]>([])

  selectedDocumentTypes = signal<dctTypesShortValues[]>([])

  templatesList = signal<DctBasicPromotionInfoModel[]>([])
  selectedTemplate = signal<DctBasicPromotionInfoModel | null>(null)

  loadedFilesPercent = signal<number | null>(null)

  writingOffConfirmed = computed(() => {
    if (this.currentStep() === 1) return this.writingOffService.inputWritingOffData().every((data) => data.confirmed)

    return this.templatesList()
      .filter((data) => data.templateType === dctTypesShortEnum.WRITING_OFF_CONTRACT)
      .every((data) => data.confirmed)
  })
  informLetterConfirmed = computed(() => {
    return this.templatesList()
      .filter((data) => data.templateType === dctTypesShortEnum.ASSIGNMENT_LETTER)
      .every((data) => data.confirmed)
  })
  guaranteeLetterConfirmed = computed(() => {
    if (this.currentStep() === 1)
      return this.guaranteeLetterService.inputGuaranteeLetterData().every(data => data.confirmed)

    return this.templatesList()
      .filter(data => data.templateType === dctTypesShortEnum.GUARANTEE_LETTER)
      .every(data => data.confirmed)
  })
  abstractConfirmed = computed(() => {
    if (this.currentStep() === 1)
      return this.abstractService.inputAbstractData().every(data => data.confirmed)

    return this.templatesList()
      .filter(data => data.templateType === dctTypesShortEnum.ABSTRACT)
      .every(data => data.confirmed)
  })

  itemLoading$ = new BehaviorSubject<boolean>(false)
  itemLoadingFinished$ = this.itemLoading$.pipe(
    map((loading) => (loading ? 1 : -1)),
    scan((acc, curr) => (acc + curr >= 0 ? acc + curr : 0), 0),
    map((count) => count > 0)
  )
  loading$ = combineLatest([
    this.itemLoadingFinished$,
    this.writingOffService.loading$,
    this.informLetterService.loading$,
    this.guaranteeLetterService.loading$,
    this.abstractService.loading$
  ])
    .pipe(map((loadings) => loadings.some(loading => loading)))

  prepareDataForTemplates(id?: number): number[] {
    let dataForTemplates: number[] = this.promotionsDataService.tableData.map((row) => row['id'])

    if (id !== undefined) {
      dataForTemplates = dataForTemplates.filter((promotionId) => promotionId === id)
    } else if (this.promotionsFiltersService.checkedRows.length > 0) {
      dataForTemplates = dataForTemplates.filter((promotionId) => {
        this.promotionsFiltersService.checkedRows.includes(promotionId)
      })
    } else if (this.sendingDocsFiltersService.selectedRowIds$.value.length > 0) {
      dataForTemplates = this.sendingDocsFiltersService.selectedRowIds$.value
    }
    return dataForTemplates
  }

  downloadZipTemplates() {
    this.downloadZipArchive(this.prepareDataForTemplates(), true, () => {
      this.itemLoading$.next(false)
      this.messageService.sendInfo('Файл завантажено')
      this.promotionDataService.updateRow()
      this.sendingDocsFiltersService.selectedRowIds$.next([])
    })
  }

  createTemplates(id?: number) {
    /* Початкова точка входу в потік створення шаблонів */
    this.itemLoading$.next(true)

    let dataForTemplates: number[] = this.promotionsDataService.tableData.map((row) => row['id'])

    if (id !== undefined) dataForTemplates = dataForTemplates.filter((promotionId) => promotionId === id)
    else if (this.promotionsFiltersService.checkedRows.length > 0)
      dataForTemplates = dataForTemplates.filter((promotionId) =>
        this.promotionsFiltersService.checkedRows.includes(promotionId)
      )

    this.getTemplatesListToCreate(dataForTemplates)
  }

  getTemplatesListToCreate(promotionIds: number[]) {
    /* Отримання списку ДС/РС та обраних шаблонів для створення */

    this.writingOffService.inputWritingOffData.set([])
    this.writingOffService.writingOffData.set([])
    this.informLetterService.informLetterTemplatesData.set([])
    this.abstractService.abstractData.set([])

    if (promotionIds.length === 0) {
      this.itemLoading$.next(false)
      return
    }

    this.httpService
      .getTemplatesList(promotionIds, this.selectedDocumentTypes(), this.canCreateRepeatedTemplate())
      .subscribe({
        next: (templateTypes) => {
          const selectedIds = templateTypes.map((obj) => obj.id)

          const templateList: DctBasicPromotionInfoModel[] = []

          this.promotionsDataService.tableData
            .filter((promotion) => selectedIds.includes(promotion['id']))
            .forEach((promotion) => {
              templateTypes
                .filter((template) => template.id === promotion['id'])
                .forEach((template) =>
                  templateList.push({
                    id: template.id,
                    contractId: promotion['Системний номер договору'],
                    clientName: promotion['ПІБ'],
                    projectManager: promotion['ПМ'],
                    projectName: promotion['Назва проєкту'],
                    templateType: template.docType,
                    confirmed: false
                  })
                )
            })
          console.log(templateList)
          this.templatesList.set(templateList)
        },
        error: (err) => {
          this.messageService.sendError(err.error.detail)
          this.itemLoading$.next(false)
        },
        complete: () => {
          this.itemLoading$.next(false)
          this.navigationService.navigate('/discounts/promotions_table/create_templates')
        }
      })
  }

  getRefNumberCompanies() {
    this.httpService.getRefNumberCompanies().subscribe({
      next: (data: string[]) => this.refNumberCompanies.set(data),
      error: (err) => this.messageService.sendError(err.error.detail)
    })
  }

  getRefNumbersJournal(journalDateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.itemLoading$.next(true)

    this.httpService.getRefNumbersJournalExcel(this.selectedRefNumberCompanies(), journalDateFilter).subscribe({
      next: (res) => {
        try {
          UtilFunctions.saveFileFromHttp(res, true)
        } catch (e) {
          this.messageService.sendError(`Виникла помилка: ${e}`)
        }
      },
      error: async (error) => {
        this.messageService.sendError('Не вдалося завантажити файл: ' + JSON.parse(await error.error.text()).detail)
        this.itemLoading$.next(false)
      },
      complete: () => this.itemLoading$.next(false)
    })
  }

  buildTemplates() {
    /*
     * Створення файлів шаблонів з даних шаблонів
     */
    this.itemLoading$.next(true)
    // Map для збереження типу шаблону та відповідних signal
    const dataToBuild = new Map<dctTypesShortValues, WritableSignal<DctDataType[]>>([
      [dctTypesShortEnum.ASSIGNMENT_LETTER, this.informLetterService.informLetterTemplatesData],
      [dctTypesShortEnum.WRITING_OFF_CONTRACT, this.writingOffService.writingOffData],
      [dctTypesShortEnum.GUARANTEE_LETTER, this.guaranteeLetterService.guaranteeLetterTemplatesData],
      [dctTypesShortEnum.ABSTRACT, this.abstractService.abstractData]
    ])

    // Підрахунок загальної кількості файлів для створення
    const dataToBuildLength = Array.from(dataToBuild.entries()).reduce((acc, [_, data]) => acc + data().length, 0)
    // Масив запитів для створення файлів (у вигляді [запит, тип шаблону])
    const requests = Array.from(dataToBuild.entries())
      .reduce(
        (acc, [type, data]) => {
          if (data().length === 0) return acc

          return [
            ...acc,
            ...data().map((template) =>
              this.httpService
                .buildTemplate(template, type)
                .pipe(map((res) => [res, type] as [HttpResponse<Blob>, dctTypesShortValues]))
            )
          ]
        },
        [] as Observable<[HttpResponse<Blob>, dctTypesShortValues]>[]
      )
      .map((request) =>
        request.pipe(
          // Обробка помилок при створенні файлів
          catchError(async (err) => {
            await this.messageService.alertFileError(err)
            return null
          })
        )
      )

    let currentTemplates: DctDataType[] = []
    let indexBias = 0

    // Виконання запитів та збереження файлів
    this.loadedFilesPercent.set(0)

    from(requests)
      .pipe(
        // Виконання запитів по черзі.
        // !!!------ ПАРАЛЕЛЬНО ЗАПУСКАТИ НЕ МОЖНА, БО ВОРД НА СЕРВЕРІ ПОМИРАЄ ------!!!
        concatMap((request) => request),
        // Обробка результатів запитів
        reduce(
          (acc, resp, index) => {
            const [docNum, lastTemplateType] = acc
            this.loadedFilesPercent.set((docNum + 1) / dataToBuildLength)

            if (resp === null) return [docNum + 1, lastTemplateType] as [number, dctTypesShortValues | null]

            const [res, currentTemplateType] = resp
            if (lastTemplateType === null) {
              // Якщо це перший файл, то записуємо дані шаблону в currentTemplates
              currentTemplates = dataToBuild.get(currentTemplateType)!()
            }

            // indexBias - зміщення індексу файлу в масиві currentTemplates
            index -= indexBias

            // Якщо це був останній файл, то змінюємо indexBias та записуємо дані нового шаблону в currentTemplates
            if (index === currentTemplates.length) {
              indexBias += currentTemplates.length
              index -= currentTemplates.length
              currentTemplates = dataToBuild.get(currentTemplateType)!()
            }

            // Збереження файлу в fileBlob + fileBlobName
            try {
              const [fileBlob, fileBlobName] = UtilFunctions.fileFromHttpToBlob(res, true)
              currentTemplates[index].fileBlob = fileBlob
              currentTemplates[index].fileBlobName = fileBlobName || null
            } catch (e) {
              this.messageService.sendError(`Виникла помилка: ${e}`)
            }

            // Якщо це був останній файл, то зберігаємо дані шаблону в signal
            if (index + 1 === currentTemplates.length) {
              dataToBuild.get(currentTemplateType)!.set([...currentTemplates])
            }

            return [docNum + 1, currentTemplateType] as [number, dctTypesShortValues]
          },
          [0, null] as [number, dctTypesShortValues | null]
        )
      )
      .subscribe({
        error: async (error: AsyncErrorModel) => {
          await this.messageService.alertFileError(error)
        },
        complete: () => {
          this.loadedFilesPercent.set(null)

          // Позначення файлів як завантажених
          dataToBuild.forEach((data) => {
            data.update((data) => data.map((template) => ({ ...template, fileLoaded: true })))
          })

          this.itemLoading$.next(false)
        }
      })
  }

  downloadZipArchive(ids: number[], saveFiles: boolean = false, callback: () => void = () => {}) {
    const params = new HttpParams().set('save_files', saveFiles)

    this.httpService.downloadZipArchive(ids, params).subscribe({
      next: (res) => {
        try {
          UtilFunctions.saveFileFromHttp(res, false, 'Архів з документами')
        } catch (e) {
          this.messageService.sendError(`Не вдалося завантажити файли: ${e}`)
        }
      },
      error: async (error) => {
        await this.messageService.alertFileError(error)
      },
      complete: () => {
        callback()
        this.promotionDataService.updateSendingRows(ids)
        this.sendingDocsFiltersService.getFilteredApplications().pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
      }
    })
  }

  downloadTemplates$(saveFiles: boolean = false, data: DctDataType[]) {
    const formData = new FormData()
    for (const template of data) {
      if (template.fileBlob)
        formData.append(
          'files',
          template.fileBlob,
          template.fileBlobName || `${template.ContractId}_${template.ClientName}`
        )
    }
    if (!formData.has('files')) {
      this.messageService.sendError('Немає файлів для завантаження')
      return
    }

    this.itemLoading$.next(true)

    return this.httpService.downloadTemplates(formData, saveFiles)
  }

  resetConfirmation() {
    this.templatesList.update((data) => data.map((prom) => ({ ...prom, confirmed: false })))

    this.writingOffService.inputWritingOffData.update((data) => data.map((prom) => ({ ...prom, confirmed: false })))
    this.writingOffService.writingOffData.update((data) => data.map((prom) => ({ ...prom, confirmed: false })))
    this.abstractService.inputAbstractData.update((data) => data.map((prom) => ({ ...prom, confirmed: false })))
    this.abstractService.abstractData.update((data) => data.map((prom) => ({ ...prom, confirmed: false })))


    this.informLetterService.informLetterTemplatesData.update((data) =>
      data.map((prom) => ({ ...prom, confirmed: false }))
    )

    this.guaranteeLetterService.inputGuaranteeLetterData
      .update(data => data.map(prom => ({ ...prom, confirmed: false })))
    this.guaranteeLetterService.guaranteeLetterTemplatesData
      .update(data => data.map(prom => ({ ...prom, confirmed: false })))
    this.abstractService.inputAbstractData
      .update(data => data.map(prom => ({ ...prom, confirmed: false })))
    this.abstractService.abstractData
      .update(data => data.map(prom => ({ ...prom, confirmed: false })))
  }

  resetTemplates() {
    const confirmedTemplateIds = this.templatesList().map(row => row.id)

    this.promotionsDataService.tableData.forEach(item => {
      if (confirmedTemplateIds.includes(item['id'])) {
        const currentDate = new Date()
        const day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate()
        const month = (currentDate.getMonth() + 1 < 10 ? '0' : '') + (currentDate.getMonth() + 1)
        const year = currentDate.getFullYear()
        const formattedDate = `${day}.${month}.${year}`
        item['Документ Затверджено'] = formattedDate
      }
    })
    this.selectedTemplate.set(null)
    this.templatesList.set([])
    this.writingOffService.inputWritingOffData.set([])
    this.writingOffService.writingOffData.set([])
    this.informLetterService.informLetterTemplatesData.set([])
    this.guaranteeLetterService.inputGuaranteeLetterData.set([])
    this.guaranteeLetterService.guaranteeLetterTemplatesData.set([])
    this.abstractService.inputAbstractData.set([])
    this.abstractService.abstractData.set([])
    this.navigationService.navigateBack('/discounts/promotions_table/templates')

  }


  openTemplateTypeChooseModal(id?: number) {
    const modalRef = this.modalService.open(DctTypeChooseComponent, {
      size: 'lg',
      centered: true,
      scrollable: true
    })
    const componentInstance = modalRef.componentInstance as DctTypeChooseComponent
    componentInstance.templateTypes = [...this.templateTypes]
    componentInstance.selectedDocumentTypes = [...this.templateTypes]
    componentInstance.canCreateRepeatedTemplate = this.canCreateRepeatedTemplate()

    modalRef.result
      .then((result: { selectedDocumentTypes: dctTypesShortValues[]; canCreateRepeatedTemplate: boolean }) => {
        this.selectedDocumentTypes.set(result.selectedDocumentTypes)
        this.canCreateRepeatedTemplate.set(result.canCreateRepeatedTemplate)
        this.createTemplates(id)
      })
      .catch()
  }

  getContractPromotionsForRefNumber(contractId: number) {
    return this.httpService.getContractPromotionsForRefNumber(contractId)
  }

  insertNewRefNumber(newRefNumber: DctRefNumberModel) {
    this.itemLoading$.next(true)

    this.httpService.insertNewRefNumber(newRefNumber).subscribe({
      next: () => this.messageService.sendInfo('Вих. номер успішно додано'),
      error: (error) => {
        this.messageService.sendError(error.error.detail)
        this.itemLoading$.next(false)
      },
      complete: () => this.itemLoading$.next(false)
    })
  }
}
