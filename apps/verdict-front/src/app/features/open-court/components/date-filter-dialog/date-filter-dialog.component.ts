import { Component, inject } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { NgForOf } from '@angular/common'

@Component({
  selector: 'app-date-filter-dialog',
  standalone: true,
  imports: [
    NgForOf
  ],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Выберите дату ухвалення</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- Используем мок данные для отображения -->
      <ul>
        <li *ngFor="let date of mockDates">
          <button class="btn btn-link" (click)="selectDate(date)">{{ date }}</button>
        </li>
      </ul>
    </div>
  `
})
export class DateFilterDialogComponent {
  activeModal = inject(NgbActiveModal)

  mockDates: string[] = ['2024-01-01', '2024-01-15', '2024-02-01', '2024-02-15']

  selectDate(date: string): void {
    // Здесь вы можете обработать выбранную дату
    console.log('Selected date:', date)
    this.activeModal.close(date)
  }
}
