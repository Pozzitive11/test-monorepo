import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqCheckElementsService } from '../../service/req-check-elements.service';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';

@Component({
  selector: 'app-req-check-fin-api',
  standalone: true,
  imports: [CommonModule, FormatAnyValuePipe],
  templateUrl: './req-check-fin-api.component.html',
  styleUrls: ['./req-check-fin-api.component.css'],
})
export class ReqCheckFinApiComponent {
  public readonly elementService = inject(ReqCheckElementsService);

  userIncome() {
    this.elementService.userIncomeNcsCredits();
  }
}
