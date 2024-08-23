import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqCheckElementsService } from '../../service/req-check-elements.service';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';

@Component({
  selector: 'app-req-check-income-ncs-credits',
  standalone: true,
  imports: [CommonModule, FormatAnyValuePipe],
  templateUrl: './req-check-income-ncs-credits.component.html',
  styleUrls: ['./req-check-income-ncs-credits.component.css'],
})
export class ReqCheckIncomeNcsCreditsComponent {
  public readonly elementService = inject(ReqCheckElementsService);

  /*ngOnInit() {
    this.elementService.userAsepInfo();


  }*/
}
