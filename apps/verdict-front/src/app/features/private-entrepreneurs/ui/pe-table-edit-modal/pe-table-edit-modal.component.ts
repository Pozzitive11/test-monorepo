import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit, signal } from '@angular/core'
import { NgbActiveModal, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'pe-table-edit-modal',
  standalone: true,
  imports: [CommonModule, NgbProgressbar, DefaultDropdownComponent],
  templateUrl: './pe-table-edit-modal.component.html'
})
export class PeTableEditModalComponent implements OnInit {
  readonly activeModal = inject(NgbActiveModal)

  @Input() row: { [key: string]: any } = {}
  @Input() loading: boolean = false
  @Input() paymentTypes: string[] = []

  paymentType = signal<string>('')

  ngOnInit() {
    this.paymentType.set(this.row['Тип платежу'])
  }

  save() {
    this.row['Тип платежу'] = this.paymentType()
    this.activeModal.close(this.row)
  }

}
