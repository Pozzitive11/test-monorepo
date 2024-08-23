import { Component, computed, inject } from '@angular/core'
import { MessageHandlingService } from '../../services/message-handling.service'
import { NgFor, NgIf } from '@angular/common'
import { NgbToast } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgbToast]
})
export class MessageBoxComponent {
  private messageService = inject(MessageHandlingService)

  activeMessages = computed(() => (this.messageService.dataInfos().length + this.messageService.dataErrors().length) > 0)
  errors = computed(() => this.messageService.dataErrors())
  infos = computed(() => this.messageService.dataInfos())

  hideError(error: string) { this.messageService.removeError(error) }

  hideInfo(info: string) { this.messageService.removeInfo(info) }

  hideAll() { this.messageService.clearAll() }
}
