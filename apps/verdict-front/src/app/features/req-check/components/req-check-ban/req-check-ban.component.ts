import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-ban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-ban.component.html',
  styleUrls: ['./req-check-ban.component.css']
})
export class ReqCheckBanComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userBan() {
    this.elementService.userBanned()
  }

}
