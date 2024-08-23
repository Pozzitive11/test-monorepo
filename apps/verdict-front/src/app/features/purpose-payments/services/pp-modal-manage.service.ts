import { inject, Injectable } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NavigationService } from '../../../core/services/navigation.service'
import { ChooseFromModalComponent } from '../../../shared/components/choose-from-modal/choose-from-modal.component'
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { PpHttpClientService } from './pp-http-client.service'
import { PpTableDataService } from './pp-table-data.service'

const WARNING_THRESHOLD = 3000

@Injectable({
  providedIn: 'root'
})
export class PpModalManageService {
  private readonly tableDataService = inject(PpTableDataService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly navigationService = inject(NavigationService)
  private readonly httpService = inject(PpHttpClientService)
  private readonly modalService = inject(NgbModal)

  async openOptionsModal(ids: string[], callback: () => void) {
    const modalRef = this.modalService.open(ChooseFromModalComponent, { centered: true })
    const component = modalRef.componentInstance as ChooseFromModalComponent

    component.title = 'Оберіть опцію'
    component.options = ['Завантажити дані в інтерфейс', 'Завантажити дані в Excel-файл']

    try {
      const result = await modalRef.result
      if (result === 'Завантажити дані в Excel-файл')
        this.getExcelFileFromIds(ids, callback)
      else if (result === 'Завантажити дані в інтерфейс') {
        if (ids.length > WARNING_THRESHOLD)
          await this.openConfirmationModal(ids, callback)
        else {
          this.navigationService.navigate(
            '/purpose_payments',
            () => this.tableDataService.uploadDataFromIds(ids)
          )
          callback()
        }
      } else
        callback()
    } catch (e) {
      callback()
    }
  }

  async openConfirmationModal(ids: string[], callback: () => void) {
    try {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true })
      const component = modalRef.componentInstance as ConfirmationModalComponent
      const alternativeAction = 'Завантажити дані в Excel-файл замість інтерфейсу'

      component.confirmButtonType = 'danger'
      component.title = `Знайдено ${ids.length} платежів`
      component.confirmText = `Ви збираєтесь завантажити ${ids.length} платежів, що може призвести до повільної роботи системи. Ви впевнені, що хочете продовжити?`
      component.alternativeAction = alternativeAction

      const result: typeof alternativeAction | null = await modalRef.result
      if (result === alternativeAction)
        return this.getExcelFileFromIds(ids, callback)
    } catch (e) {
      return await this.openOptionsModal(ids, callback)
    }

    this.navigationService.navigate(
      '/purpose_payments',
      () => this.tableDataService.uploadDataFromIds(ids)
    )
    callback()
  }

  getExcelFileFromIds(ids: string[], callback: () => void) {
    this.httpService.getFileWithSelectedIds(ids, this.tableDataService.processType).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, `Buffer_`),
      error: async error => {
        await this.messageService.alertFileError(error)
        callback()
      },
      complete: callback
    })
  }

}
