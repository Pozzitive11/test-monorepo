import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-open-credit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-open-credit.component.html',
  styleUrls: ['./req-check-open-credit.component.css']
})
export class ReqCheckOpenCreditComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userOpen() {
    this.elementService.userOpenCredit()
  }

}
