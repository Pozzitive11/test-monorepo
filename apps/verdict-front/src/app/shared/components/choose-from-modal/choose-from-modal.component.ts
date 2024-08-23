import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-choose-from-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-from-modal.component.html'
})
export class ChooseFromModalComponent {
  readonly activeModal = inject(NgbActiveModal)

  @Input() title: string = 'Оберіть опцію'
  @Input() options: string[] = []

}
