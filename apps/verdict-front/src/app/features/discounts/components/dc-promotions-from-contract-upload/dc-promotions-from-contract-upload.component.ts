import { Component, inject } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'

@Component({
  selector: 'dc-promotions-from-contract-upload',
  templateUrl: './dc-promotions-from-contract-upload.component.html',
  standalone: true,
  imports: [SwitchCheckboxComponent, FormsModule]
})
export class DcPromotionsFromContractUploadComponent {
  readonly activeModal = inject(NgbActiveModal)
  contractsList: string = ''
  selectLatestOnly: boolean = true

}
