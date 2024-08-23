import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqCheckElementsService } from '../../service/req-check-elements.service';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';

@Component({
  selector: 'app-req-check-courtdata',
  standalone: true,
  imports: [CommonModule, FormatAnyValuePipe],
  templateUrl: './req-check-courtdata.component.html',
  styleUrls: ['./req-check-courtdata.component.css'],
})
export class ReqCheckCourtdataComponent {
  public readonly elementService = inject(ReqCheckElementsService);

  userCourt() {
    this.elementService.userCourtData();
  }
}
