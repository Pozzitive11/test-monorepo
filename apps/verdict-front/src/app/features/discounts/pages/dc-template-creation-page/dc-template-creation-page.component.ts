import { Component, computed, effect, inject, OnInit } from '@angular/core'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { forkJoin, Observable, switchMap, tap } from 'rxjs'
import { NavigationService } from '../../../../core/services/navigation.service'
import { ServerBasicResponse } from '../../../../data-models/server-data.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { isDctBaseModel } from '../../models/dc-template-models/dct-base.model'
import { DctGuaranteeLetterDataModel } from '../../models/dc-template-models/dct-guarantee-letter-data.model'
import { DctGuaranteeLetterInputDataModel } from '../../models/dc-template-models/dct-guarantee-letter-input-data.model'
import { DctInformLetterDataModel } from '../../models/dc-template-models/dct-inform-letter-data.model'
import { DctInputWritingOffDataModel } from '../../models/dc-template-models/dct-input-writing-off-data.model'
import { dctTypesShortEnum, dctTypesShortValues } from '../../models/dc-template-models/dct-types.enum'
import { DctWritingOffDataModel } from '../../models/dc-template-models/dct-writing-off-data.model'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import { DcTemplateInformLetterService } from '../../services/templates/dc-template-inform-letter.service'
import { DcTemplateWritingOffContractService } from '../../services/templates/dc-template-writing-off-contract.service'
import { DctGuaranteeLetterService } from '../../services/templates/dct-guarantee-letter.service'
import { DcTemplateAbstractContractService } from '../../services/templates/dc-template.abstract.service'
import { DctAbstractDataModel } from '../../models/dc-template-models/dct-abstract.data.model'
import { DctAbstarctInputDataModel } from '../../models/dc-template-models/dct-abstract-input-data.model'
import { DctInformLetterCardsComponent } from '../../components/dc-templates/dct-inform-letter-cards/dct-inform-letter-cards.component'
import { DctConfirmGuaranteeLetterCardsComponent } from '../../components/dc-templates/dct-confirm-guarantee-letter-cards/dct-confirm-guarantee-letter-cards.component'
import { DctInputGuaranteeLetterCardsComponent } from '../../components/dc-templates/dct-input-guarantee-letter-cards/dct-input-guarantee-letter-cards.component'
import { DctConfirmCardsComponent } from '../../components/dc-templates/dct-confirm-cards/dct-confirm-cards.component'
import { DctInputCardsComponent } from '../../components/dc-templates/dct-input-cards/dct-input-cards.component'
import { DctAbstractConfirmCardsComponent } from '../../components/dc-templates/dct-abstract-confirm-cards/dct-abstract-confirm-cards.component'
import { DctInputAbstractCardsComponent } from '../../components/dc-templates/dct-abstract-cards/dct-abstract-cards.component'
import { DctPreviewCardsComponent } from '../../components/dc-templates/dct-preview-cards/dct-preview-cards.component'
import { DctListComponent } from '../../components/dc-templates/dct-list/dct-list.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { AsyncPipe, NgIf } from '@angular/common'

type TUpdateFunc =
  | DctWritingOffDataModel
  | DctInputWritingOffDataModel
  | DctInformLetterDataModel
  | DctGuaranteeLetterDataModel
  | DctGuaranteeLetterInputDataModel
  | DctAbstractDataModel
  | DctAbstarctInputDataModel

@Component({
  selector: 'dc-template-creation-page',
  templateUrl: './dc-template-creation-page.component.html',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    NgIf,
    NgbProgressbar,
    DctListComponent,
    DctPreviewCardsComponent,
    DctInputAbstractCardsComponent,
    DctAbstractConfirmCardsComponent,
    DctInputCardsComponent,
    DctConfirmCardsComponent,
    DctInputGuaranteeLetterCardsComponent,
    DctConfirmGuaranteeLetterCardsComponent,
    DctInformLetterCardsComponent,
    AsyncPipe
  ]
})
export class DcTemplateCreationPageComponent implements OnInit {
  readonly spinner = inject(NgxSpinnerService)

  private readonly messageService = inject(MessageHandlingService)
  readonly navigationService = inject(NavigationService)

  readonly promotionsDataService = inject(DcPromotionsDataService)
  readonly templatesService = inject(DcTemplatesService)
  readonly informLetterService = inject(DcTemplateInformLetterService)
  readonly writingOffService = inject(DcTemplateWritingOffContractService)
  readonly guaranteeLetterService = inject(DctGuaranteeLetterService)
  readonly abstractService = inject(DcTemplateAbstractContractService)

  loading$ = this.templatesService.loading$.pipe(
    tap((loading) => (loading ? this.spinner.show() : this.spinner.hide()))
  )

  shownTemplateData = computed(() => {
    const selectedTemplate = this.templatesService.selectedTemplate()
    if (!selectedTemplate) return null

    switch (selectedTemplate.templateType) {
      case dctTypesShortEnum.WRITING_OFF_CONTRACT:
        return this.writingOffService.writingOffData().filter((data) => data.PromotionId === selectedTemplate.id)[0]
      case dctTypesShortEnum.ABSTRACT:
        return this.abstractService.abstractData().filter((data) => data.PromotionId === selectedTemplate.id)[0]
      case dctTypesShortEnum.ASSIGNMENT_LETTER:
        return this.informLetterService
          .informLetterTemplatesData()
          .filter((data) => data.PromotionId === selectedTemplate.id)[0]
      case dctTypesShortEnum.GUARANTEE_LETTER:
        return this.guaranteeLetterService
          .guaranteeLetterTemplatesData()
          .filter((data) => data.PromotionId === selectedTemplate.id)[0]
      default:
        return null
    }
  })

  stepMessage: string = 'Обробка...'
  showingElements = {
    writingOff: true,
    informLetter: true,
    guaranteeLetter: true,
    abstract: true
  }

  get currentStep() {
    return this.templatesService.currentStep()
  }

  get percent() {
    return this.templatesService.loadedFilesPercent()
  }

  someNotConfirmed = computed(() => {
    if (this.currentStep === 0) return false
    if (this.currentStep === 1)
      return (
        this.writingOffService.inputWritingOffData().some((data) => !data.confirmed) ||
        this.guaranteeLetterService.inputGuaranteeLetterData().some((data) => !data.confirmed) ||
        this.abstractService.inputAbstractData().some((data) => !data.confirmed)
      )

    return this.templatesService.templatesList().some((data) => !data.confirmed)
  })
  someFilesNotLoaded = computed(() => {
    if (this.currentStep !== 3) return false

    return (
      this.writingOffService.writingOffFailedDocLoads().length > 0 ||
      this.informLetterService.informLetterFailedDocLoads().length > 0 ||
      this.guaranteeLetterService.guaranteeLetterFailedDocLoads().length > 0 ||
      this.abstractService.abstractFailedDocLoads().length > 0
    )
  })

  constructor() {
    effect(() => {
      if (this.templatesService.templatesList().length === 0)
        this.navigationService.navigateBack('/discounts/promotions_table/templates')
    })
  }

  ngOnInit() {
    this.templatesService.currentStep.set(0)
  }

  nextStep() {
    if (this.currentStep === 0) {
      this.stepMessage = 'Завантаження даних...'
      const selectedIdsAbstract: number[] = []
      const selectedIdsWriteOff: number[] = []
      const selectedIdsInformLetter: number[] = []
      const selectedIdsGuaranteeLetter: number[] = []

      this.templatesService.templatesList().forEach((obj) => {
        switch (obj.templateType) {
          case dctTypesShortEnum.WRITING_OFF_CONTRACT:
            selectedIdsWriteOff.push(obj.id)
            break
          case dctTypesShortEnum.ASSIGNMENT_LETTER:
            selectedIdsInformLetter.push(obj.id)
            break
          case dctTypesShortEnum.GUARANTEE_LETTER:
            selectedIdsGuaranteeLetter.push(obj.id)
            break
          case dctTypesShortEnum.ABSTRACT:
            selectedIdsAbstract.push(obj.id)
            break
        }
      })

      this.writingOffService.createWritingOffTemplates(
        this.promotionsDataService.tableData.filter((prom) => selectedIdsWriteOff.includes(prom['id']))
      )
      this.abstractService.createAbstractTemplates(
        this.promotionsDataService.tableData.filter((prom) => selectedIdsAbstract.includes(prom['id']))
      )
      this.guaranteeLetterService.createGuaranteeLetterTemplates(
        this.promotionsDataService.tableData.filter((prom) => selectedIdsGuaranteeLetter.includes(prom['id']))
      )
      this.informLetterService.createInformLetterTemplates(selectedIdsInformLetter)
      if (
        selectedIdsWriteOff.length === 0 &&
        selectedIdsGuaranteeLetter.length === 0 &&
        selectedIdsAbstract.length === 0
      ) {
        this.templatesService.currentStep.set(this.currentStep + 1)
        this.nextStep()
        return
      }
    }

    if (this.currentStep === 1) {
      this.stepMessage = 'Отримання даних...'
      this.writingOffService.fillTemplatesData()
      this.guaranteeLetterService.fillGuaranteeLetterTemplates()
      this.abstractService.fillAbstractTemplatesData()
    } else if (this.currentStep === 2) {
      this.stepMessage = 'Заповнення шаблонів...'
      this.templatesService.buildTemplates()
    } else if (this.currentStep === 3) {
      this.stepMessage = 'Обробка...'
      this.templatesService.itemLoading$.next(true)

      const templatesData: (
        | DctWritingOffDataModel
        | DctInformLetterDataModel
        | DctGuaranteeLetterDataModel
        | DctAbstractDataModel
      )[] = []
      this.writingOffService.writingOffData().forEach((row) => templatesData.push(row))
      this.informLetterService.informLetterTemplatesData().forEach((row) => templatesData.push(row))
      this.guaranteeLetterService.guaranteeLetterTemplatesData().forEach((row) => templatesData.push(row))
      this.abstractService.abstractData().forEach((row) => templatesData.push(row))

      const requests = [
        this.writingOffService.saveTemplates(),
        this.informLetterService.saveInformLetters(),
        this.guaranteeLetterService.saveGuaranteeLetters(),
        this.abstractService.saveAbstractTemplates()
      ].filter((obs) => obs !== null) as Observable<ServerBasicResponse>[]

      this.templatesService
        .downloadTemplates$(true, templatesData)
        ?.pipe(switchMap(() => forkJoin(requests)))
        .subscribe({
          next: (results) => results.forEach((res) => this.messageService.sendInfo(res.description)),
          error: (err) => {
            this.messageService.sendError(err.error.detail)
            this.templatesService.itemLoading$.next(false)
          },
          complete: () => {
            this.templatesService.itemLoading$.next(false)
            this.templatesService.resetTemplates()
          }
        })
    }

    this.templatesService.resetConfirmation()
    this.templatesService.currentStep.set(this.currentStep + 1)
  }

  prevStep() {
    this.templatesService.currentStep.set(this.currentStep - 1)
    if (
      this.writingOffService.inputWritingOffData().length === 0 &&
      this.abstractService.inputAbstractData().length === 0 &&
      this.guaranteeLetterService.inputGuaranteeLetterData().length === 0
    )
      this.templatesService.currentStep.set(this.currentStep - 1)
  }

  removeTemplate(id: number, templateType: dctTypesShortValues | null) {
    if (!templateType) return

    this.templatesService.templatesList.set(
      this.templatesService.templatesList().filter((obj) => obj.id !== id || obj.templateType !== templateType)
    )
    if (this.currentStep > 0) {
      switch (templateType) {
        case dctTypesShortEnum.WRITING_OFF_CONTRACT:
          this.writingOffService.deleteTemplate(id)
          break
        case dctTypesShortEnum.ASSIGNMENT_LETTER:
          this.informLetterService.deleteInformLetterTemplate(id)
          break
        case dctTypesShortEnum.GUARANTEE_LETTER:
          this.guaranteeLetterService.deleteTemplate(id)
          break
        case dctTypesShortEnum.ABSTRACT:
          this.writingOffService.deleteTemplate(id)
          break
      }
    }
  }

  confirmDocument(id: number, templateType: dctTypesShortValues | null) {
    if (!templateType) return

    const confirmedIds: number[] = []

    const updateFunc = <T extends TUpdateFunc>(item: T): T => {
      if (isDctBaseModel(item) && this.currentStep === 3 && !item.fileBlob) return item

      if (item.PromotionId === id) {
        confirmedIds.push(item.PromotionId)
        item.confirmed = true
      }
      return item
    }

    switch (templateType) {
      case dctTypesShortEnum.WRITING_OFF_CONTRACT:
        if (this.currentStep === 1) this.writingOffService.inputWritingOffData.update((data) => data.map(updateFunc))
        else this.writingOffService.writingOffData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.ASSIGNMENT_LETTER:
        this.informLetterService.informLetterTemplatesData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.ABSTRACT:
        if (this.currentStep === 1) this.abstractService.inputAbstractData.update((data) => data.map(updateFunc))
        else this.abstractService.abstractData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.GUARANTEE_LETTER:
        if (this.currentStep === 1)
          this.guaranteeLetterService.inputGuaranteeLetterData.update((data) => data.map(updateFunc))
        else this.guaranteeLetterService.guaranteeLetterTemplatesData.update((data) => data.map(updateFunc))
    }

    this.templatesService.templatesList.set(
      this.templatesService.templatesList().map((obj) => {
        if (obj.id === id && obj.templateType === templateType && confirmedIds.includes(obj.id)) obj.confirmed = true
        return obj
      })
    )
  }

  confirmAllDocuments(templateType: dctTypesShortValues | null) {
    const confirmedIds: number[] = []

    const updateFunc = <T extends TUpdateFunc>(item: T): T => {
      if (isDctBaseModel(item) && this.currentStep === 3 && !item.fileBlob) return item

      confirmedIds.push(item.PromotionId)
      item.confirmed = true
      return item
    }

    switch (templateType) {
      case dctTypesShortEnum.WRITING_OFF_CONTRACT:
        if (this.currentStep === 1) this.writingOffService.inputWritingOffData.update((data) => data.map(updateFunc))
        else this.writingOffService.writingOffData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.ABSTRACT:
        if (this.currentStep === 1) this.abstractService.inputAbstractData.update((data) => data.map(updateFunc))
        else this.abstractService.abstractData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.ASSIGNMENT_LETTER:
        this.informLetterService.informLetterTemplatesData.update((data) => data.map(updateFunc))
        break
      case dctTypesShortEnum.GUARANTEE_LETTER:
        if (this.currentStep === 1)
          this.guaranteeLetterService.inputGuaranteeLetterData.update((data) => data.map(updateFunc))
        else this.guaranteeLetterService.guaranteeLetterTemplatesData.update((data) => data.map(updateFunc))
        break
      case null:
        this.writingOffService.inputWritingOffData.update((data) => data.map(updateFunc))
        this.writingOffService.writingOffData.update((data) => data.map(updateFunc))
        this.informLetterService.informLetterTemplatesData.update((data) => data.map(updateFunc))
        this.guaranteeLetterService.inputGuaranteeLetterData.update((data) => data.map(updateFunc))
        this.guaranteeLetterService.guaranteeLetterTemplatesData.update((data) => data.map(updateFunc))
        this.abstractService.abstractData.update((data) => data.map(updateFunc))
        break
    }

    this.templatesService.templatesList.set(
      this.templatesService.templatesList().map((obj) => {
        if ((obj.templateType === templateType || templateType === null) && confirmedIds.includes(obj.id))
          obj.confirmed = true
        return obj
      })
    )
  }

  rebuildTemplate(template: { id: number; templateType: dctTypesShortValues | null }) {
    const { id, templateType } = template

    switch (templateType) {
      case dctTypesShortEnum.WRITING_OFF_CONTRACT:
        this.writingOffService.buildTemplate(
          this.writingOffService.writingOffData().filter((data) => data.PromotionId === id)[0]
        )
        break
      case dctTypesShortEnum.ABSTRACT:
        this.abstractService.buildTemplate(
          this.abstractService.abstractData().filter((data) => data.PromotionId === id)[0]
        )
        break
      case dctTypesShortEnum.ASSIGNMENT_LETTER:
        this.informLetterService.buildInformLetterTemplate(
          this.informLetterService.informLetterTemplatesData().filter((data) => data.PromotionId === id)[0]
        )
        break
      case dctTypesShortEnum.GUARANTEE_LETTER:
        this.guaranteeLetterService.buildTemplate(
          this.guaranteeLetterService.guaranteeLetterTemplatesData().filter((data) => data.PromotionId === id)[0]
        )
    }
  }

  protected dctTypesShortEnum = dctTypesShortEnum
}
