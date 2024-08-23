import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-contactable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-contactable.component.html',
  styleUrls: ['./req-check-contactable.component.css']
})
export class ReqCheckContactableComponent {
  public readonly elementService = inject(ReqCheckElementsService)

  userContact() {
    this.elementService.userContactable()
  }


}
