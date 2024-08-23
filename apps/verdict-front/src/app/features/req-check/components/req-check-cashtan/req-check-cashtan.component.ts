import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'

@Component({
  selector: 'app-req-check-cashtan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-cashtan.component.html',
  styleUrls: ['./req-check-cashtan.component.css']
})
export class ReqCheckCashtanComponent {

  public readonly elementService = inject(ReqCheckElementsService)

  z: number = 3


}
