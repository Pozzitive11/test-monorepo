import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MiniExecutiveCard } from '../../models/executive-proceedings.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-executive-cards',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './executive-cards.component.html',
  styleUrls: ['./executive-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutiveCardsComponent {
  private readonly modalService = inject(NgbModal)
  
  @Input() executiveData: MiniExecutiveCard;
  @Input() FullEcecutiveCard: MiniExecutiveCard;

  
  showModal: boolean = false;
  subscribeToExecutiveProceeding() {
  }
  
  openModal(executiveData: MiniExecutiveCard): void {
    const modalref = this.modalService.open(ExecutiveCardsComponent, { centered: true, backdrop: 'static', size: 'xl' })
      modalref.componentInstance.FullEcecutiveCard = executiveData
      console.log(executiveData)
  }
  

  closeModal() {
    this.showModal = false;
  }
}