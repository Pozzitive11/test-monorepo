import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { IConfirmationModalComponentModel } from './confirmation-modal.component.model'

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent implements IConfirmationModalComponentModel {
  readonly activeModal = inject(NgbActiveModal)

  @Input() title: string = 'Необхідно підтвердити дію'
  @Input() confirmText: string = 'Підтвердіть дію, будь ласка'
  @Input() confirmButtonText: string = 'Підтвердити'
  @Input() cancelButtonText: string = 'Скасувати'
  @Input() confirmButtonType: 'primary' | 'danger' | 'success' = 'primary'
  @Input() showBody: boolean = true
  @Input() alternativeAction: string | null = null

}
