import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-cashflow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-cashflow.component.html',
  styleUrls: ['./req-check-cashflow.component.css']
})
export class ReqCheckCashflowComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userCashflow() {
    this.elementService.userCashflowClean()
  }

}
