import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-bki-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-bki-info.component.html',
  styleUrls: ['./req-check-bki-info.component.css']
})
export class ReqCheckBkiInfoComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userBki() {
    this.elementService.userBkiInfo()
  }

}
