import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReqCheckHttpService } from '../../service/req-check-http.service';

import { ReqCheckAsepInfoComponent } from '../../components/req-check-asep-info/req-check-asep-info.component';
import { ReqCheckElementsService } from '../../service/req-check-elements.service';
import { ReqCheckBanComponent } from '../../components/req-check-ban/req-check-ban.component';
import { ReqCheckBkiInfoComponent } from '../../components/req-check-bki-info/req-check-bki-info.component';
import { ReqCheckCashflowComponent } from '../../components/req-check-cashflow/req-check-cashflow.component';
import { ReqCheckContactableComponent } from '../../components/req-check-contactable/req-check-contactable.component';
import { ReqCheckCourtdataComponent } from '../../components/req-check-courtdata/req-check-courtdata.component';
import { ReqCheckIncomeNcsCreditsComponent } from '../../components/req-check-income-ncs-credits/req-check-income-ncs-credits.component';
import { ReqCheckOpenCreditComponent } from '../../components/req-check-open-credit/req-check-open-credit.component';
import { ReqCheckPaymentDelayComponent } from '../../components/req-check-payment-delay/req-check-payment-delay.component';
import { ReqCheckRiskScoringComponent } from '../../components/req-check-risk-scoring/req-check-risk-scoring.component';
import { ReqCheckWeekCreditComponent } from '../../components/req-check-week-credit/req-check-week-credit.component';
import { ReqCheckFinApiComponent } from '../../components/req-check-fin-api/req-check-fin-api.component';
import { ReqCheckCashtanComponent } from '../../components/req-check-cashtan/req-check-cashtan.component';
import { ReqCheckCashtanCanceledDocsComponent } from '../../components/req-check-cashtan-canceled-docs/req-check-cashtan-canceled-docs.component';
import { ReqCheckCreditTableComponent } from '../../components/req-check-credit-table/req-check-credit-table.component';
import { ReqCheckMilitaryComponent } from '../../components/req-check-military/req-check-military.component';
import { ReqCheckAutoComponent } from '../../components/req-check-auto/req-check-auto.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-req-check-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormatAnyValuePipe,
    ReqCheckAsepInfoComponent,
    ReqCheckBanComponent,
    ReqCheckBkiInfoComponent,
    ReqCheckCashflowComponent,
    ReqCheckContactableComponent,
    ReqCheckCourtdataComponent,
    ReqCheckIncomeNcsCreditsComponent,
    ReqCheckOpenCreditComponent,
    ReqCheckPaymentDelayComponent,
    ReqCheckRiskScoringComponent,
    ReqCheckWeekCreditComponent,
    ReqCheckFinApiComponent,
    ReqCheckCashtanComponent,
    ReqCheckCashtanCanceledDocsComponent,
    ReqCheckCreditTableComponent,
    ReqCheckMilitaryComponent,
    ReqCheckAutoComponent,
    LoadingSpinnerComponent,
  ],

  templateUrl: './req-check-page.component.html',
  styleUrls: ['./req-check-page.component.css'],
})
export class ReqCheckPageComponent {
  private readonly httpService = inject(ReqCheckHttpService);
  private readonly messageService = inject(MessageHandlingService);
  public elementService = inject(ReqCheckElementsService);

  searchType: string = '';
  ipn: string = '';
  fio: string = '';

  async infoAboutUserINN() {
    if (this.ipn !== '') {
      this.elementService.ipn = this.ipn;
      this.elementService.displayedInfo = 1;
      this.elementService.fullInfo = 1;

      this.elementService.userBanned();
      this.elementService.userCashflowClean();
      this.elementService.userBkiInfo();
      this.elementService.userOpenCredit();
      this.elementService.userWeekCredit();
      this.elementService.userRiskScoring();
      this.elementService.userPaymentDelay();
      this.elementService.userContactable();
      this.elementService.creditK1();
      this.elementService.userMilitaryInfo();

      this.elementService.displayedINN = this.ipn;
    } else {
      this.messageService.sendError('Поле IPN не має бути пустим!');
    }
  }

  async infoAboutUserAsvpNks() {
    if (this.ipn !== '') {
      this.elementService.visionCash = 0;
      this.elementService.allCashtan();
      this.elementService.loaderInfo = 0;
      this.elementService.index_check = 0;
      this.elementService.fullInfo = 0;
      this.elementService.ipn = this.ipn;
      this.elementService.displayedInfo = 1;
      this.elementService.displayedINN = this.ipn;

      this.elementService.userIncomeNcsCredits();
      this.elementService.CashtanCre();
      this.elementService.userAsepInfo();
      this.elementService.userCourtData();
      this.elementService.uploadFinApi();
      this.elementService.userProperty();
      this.elementService.userAuto();
      this.elementService.CashtanBank();
      this.elementService.CashtanCan();
      this.elementService.CashtanSan();
      this.elementService.CashtanWan();
      this.elementService.getCancel();
      this.elementService.GetCashtanBlackInCash();
      this.elementService.GetCashtanClosedInCash();
      this.elementService.GetCashtanTrueInCash();
      this.elementService.GetCashtanCashflow();
      this.elementService.GetCashtanFin();
      this.elementService.GetCashLong();
      this.elementService.CashtanPe();
      this.elementService.isClientGone();
    }
  }

  async infoAboutUserAsvpFio() {
    if (this.fio !== '') {
      this.elementService.loaderInfo = 0;
      this.elementService.fioSee = 0;
      this.elementService.index_check = 0;
      this.elementService.fullInfo = 0;
      this.elementService.name = this.fio;
      this.elementService.displayedInfo = 1;
      this.elementService.displayedINN = this.fio;
      this.elementService.uploadFinApi();
    }
  }
}
