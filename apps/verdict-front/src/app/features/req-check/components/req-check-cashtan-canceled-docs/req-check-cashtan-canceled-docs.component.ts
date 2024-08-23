import { Component, inject } from '@angular/core'
import { ReqCheckElementsService } from '../../service/req-check-elements.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-req-check-cashtan-canceled-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './req-check-cashtan-canceled-docs.component.html',
  styleUrls: ['./req-check-cashtan-canceled-docs.component.css']
})
export class ReqCheckCashtanCanceledDocsComponent {

  public readonly elementService = inject(ReqCheckElementsService)

  z: number = 3
}
