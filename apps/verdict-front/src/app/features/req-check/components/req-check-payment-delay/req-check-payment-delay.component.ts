import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-payment-delay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-payment-delay.component.html',
  styleUrls: ['./req-check-payment-delay.component.css']
})
export class ReqCheckPaymentDelayComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userPayment() {
    this.elementService.userPaymentDelay()
  }


}
