import { Component, inject, Input } from '@angular/core'
import { EpDetailedInfoModel } from '../../../models/ep-detailed-info.model'
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'lr-ep-detailed-info-edit',
  templateUrl: './lr-ep-detailed-info-edit.component.html',
  standalone: true,
  imports: [
    FormsModule,
    SumInputComponent,
    DefaultDropdownComponent,
    NgIf,
    NgbTooltip
  ]
})
export class LrEpDetailedInfoEditComponent {
  activeModal = inject(NgbActiveModal)

  readonly rewardPayerList: string[] = [
    'Боржник',
    'Стягувач'
  ]

  @Input() epDetailedInfo!: EpDetailedInfoModel

}
