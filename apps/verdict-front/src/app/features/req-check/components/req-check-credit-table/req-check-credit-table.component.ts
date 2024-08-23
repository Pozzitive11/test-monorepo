import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-credit-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-credit-table.component.html',
  styleUrls: ['./req-check-credit-table.component.css']
})
export class ReqCheckCreditTableComponent {

  public readonly elementService = inject(ReqCheckElementsService)
}
