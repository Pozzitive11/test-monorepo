import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DcTemplatesService } from '../../../services/dc-templates.service'
import { DctJournalModalComponent } from './dct-journal-modal.component'
import { DctAddManualRefModalComponent } from '../dct-add-manual-ref-modal/dct-add-manual-ref-modal.component'
import { DctRefNumberModel } from '../../../models/dc-template-models/dct-ref-number.model'

// Функція відкриття модального вікна для завантаження журналу вих. номерів
export const refNumberJournalFunction = (modal: NgbModal,
                                         templateService: DcTemplatesService,
                                         datesRange: { MinDate: NgbDate | null, MaxDate: NgbDate | null },
                                         dateFilter: { fromDate: NgbDate | null, toDate: NgbDate | null }
) => {
  const modalRef = modal.open(
    DctJournalModalComponent,
    {
      size: 'lg',
      centered: true,
      scrollable: true,
      fullscreen: 'sm'
    }
  )
  const componentInstance = modalRef.componentInstance as DctJournalModalComponent
  componentInstance.journalDatesRange = { ...datesRange }
  componentInstance.journalDateFilter = { ...dateFilter }
  componentInstance.refNumberCompanies = templateService.refNumberCompanies()
  const manualInsert$ = componentInstance.addManualRefNumber.subscribe(() => openManualRefNumberInsertModal(modal, templateService))

  modalRef.result.then((result: {
    journalDateFilter: { fromDate: NgbDate | null, toDate: NgbDate | null },
    selectedRefNumberCompanies: string[]
  }) => {
    manualInsert$.unsubscribe()
    const { journalDateFilter, selectedRefNumberCompanies } = result
    templateService.selectedRefNumberCompanies.set(selectedRefNumberCompanies)

    templateService.getRefNumbersJournal(journalDateFilter)
  }).catch(() => manualInsert$.unsubscribe())
}


// Функція для відкриття модального вікна для внесення вих. номеру вручну
export const openManualRefNumberInsertModal = (modal: NgbModal, templateService: DcTemplatesService) => {
  const manualRefModalRef = modal.open(
    DctAddManualRefModalComponent,
    {
      size: 'lg',
      centered: true,
      scrollable: true,
      fullscreen: 'sm'
    }
  )
  const manualRefComponentInstance = manualRefModalRef.componentInstance as DctAddManualRefModalComponent
  manualRefComponentInstance.refNumberCompanies = templateService.refNumberCompanies()
  const contractIdChange$ = manualRefComponentInstance.contractIdChange.subscribe((contractId: number | null) => {
    if (contractId === null) {
      templateService.messageService.sendError('Введіть НКС')
      return
    }
    manualRefComponentInstance.loading = true
    templateService.getContractPromotionsForRefNumber(contractId).subscribe({
      next: promotions => manualRefComponentInstance.contractPromotions = promotions,
      error: err => {
        templateService.messageService.sendError(err.error.detail)
        manualRefComponentInstance.loading = false
      },
      complete: () => manualRefComponentInstance.loading = false
    })
  })

  manualRefModalRef.result.then((newRefNumber: DctRefNumberModel) => templateService.insertNewRefNumber(newRefNumber))
    .catch(() => contractIdChange$.unsubscribe())
}
