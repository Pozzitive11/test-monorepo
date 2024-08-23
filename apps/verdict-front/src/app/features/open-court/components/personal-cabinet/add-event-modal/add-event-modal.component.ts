import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  templateUrl: './add-event-modal.component.html',
  imports: [
    FormsModule
  ],
})
export class AddEventModalComponent {
  @Output() eventAdded = new EventEmitter<{ title: string, start: string, location?: string }>();

  title: string = '';
  date: string = '';
  location: string = '';
  constructor(private activeModal: NgbActiveModal) {}

  addEvent() {
    this.activeModal.close({ title: this.title, date: this.date });
  }

  closeModal() {
    // Закрытие модального окна, если требуется логика для этого
  }
}