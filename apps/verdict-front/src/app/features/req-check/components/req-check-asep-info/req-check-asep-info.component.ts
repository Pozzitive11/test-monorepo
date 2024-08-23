import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqCheckElementsService } from '../../service/req-check-elements.service';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';

@Component({
  selector: 'app-req-check-asep-info',
  standalone: true,
  imports: [CommonModule, FormatAnyValuePipe],
  templateUrl: './req-check-asep-info.component.html',
  styleUrls: ['./req-check-asep-info.component.css'],
})
export class ReqCheckAsepInfoComponent {
  public readonly elementService = inject(ReqCheckElementsService);
}
