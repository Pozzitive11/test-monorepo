import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-week-credit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-week-credit.component.html',
  styleUrls: ['./req-check-week-credit.component.css']
})
export class ReqCheckWeekCreditComponent {

  public readonly elementService = inject(ReqCheckElementsService)

  userWeek() {
    this.elementService.userWeekCredit()
  }
}
