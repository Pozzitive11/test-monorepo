import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToSignals } from '../../utils/typing.utils'
import { InputModalComponentModel } from './input-modal.component.model'

@Component({
  selector: 'app-input-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './input-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputModalComponent implements ToSignals<InputModalComponentModel> {
  readonly activeModal = inject(NgbActiveModal)

  typeOfInput = input<'text' | 'number'>('text')
  value = model.required<string>()
  placeholder = input<string>('...')
  title = input<string>('хало')
}
