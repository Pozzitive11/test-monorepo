import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-risk-scoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-risk-scoring.component.html',
  styleUrls: ['./req-check-risk-scoring.component.css']
})
export class ReqCheckRiskScoringComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userRisk() {
    this.elementService.userRiskScoring()
  }

}
