import { HttpClient, HttpParams } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { ReqAsep } from '../models/req-asep.model';
import { BKI, BKICash } from '../models/req-bki.model';
import { Contactable } from '../models/req-contactable.model';
import { CourtData } from '../models/req-court.model';
import { IncomeAndNcsCredits } from '../models/req-income-nks-credits.model';
import { CanceledDocs } from '../models/req-cancelled-docs.model';
import { FinApiCashtan } from '../models/req-cashtan-fin.model';
import { SanctionsCashtan } from '../models/req-cashtan-sanctions.model';
import { environment } from 'apps/verdict-front/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReqCheckHttpService {
  private http = inject(HttpClient);

  url =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    environment.req_check;

  finapiUrl =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    '/fin_api/make_request';

  ubkiUrl =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    '/CashtanApi/ubki_info';

  cashtanDbDataUrl =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    '/CashtanApi/cashtan_db_data';

  clientObjectsUrl =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    '/long_req/client_objects';

  /*/api/v0/CashtanApi/ubki_info/update_info - получить неполученные данные по xml файлам из каштана (По идее должны использовать перед каждым запросом)
    /api/v0/CashtanApi/ubki_info/get_credit_data/{user_inn} - Абсолютні та відносні кредитні показники
    /api/v0/CashtanApi/ubki_info/get_credit_data/{user_inn} - ПЕП (Інформація з відкритого реєстру національних публічних діячів України)
    /api/v0/CashtanApi/ubki_info/get_bankruptcy_info/{user_inn} - Банкротство
    /api/v0/CashtanApi/ubki_info/get_wanted_mvs_info/{user_inn} - Пошук у розшуковій базі даних МВС
    /api/v0/CashtanApi/ubki_info/get_sanctions_info/{user_inn} - Інформація із санкційних списків
    /api/v0/CashtanApi/ubki_info/get_cancelled_docs/{user_inn} - Пошук анульованих документів*/

  cashtanAll() {
    return this.http.get<any>(this.ubkiUrl + '/update_info');
  }

  cashtanGetCredit(inn: string) {
    return this.http.get<BKICash>(
      this.ubkiUrl + '/get_credit_data' + '/' + inn
    );
  }

  cashtanGetBankruptcy(inn: string) {
    return this.http.get<any>(
      this.ubkiUrl + '/get_bankruptcy_info' + '/' + inn
    );
  }

  cashtanGetWanted(inn: string) {
    return this.http.get<any>(
      this.ubkiUrl + '/get_wanted_mvs_info' + '/' + inn
    );
  }

  cashtanGetSanctions(inn: string) {
    return this.http.get<SanctionsCashtan>(
      this.ubkiUrl + '/get_sanctions_info' + '/' + inn
    );
  }

  cashtanGetCancelled(inn: string) {
    return this.http.get<any>(this.ubkiUrl + '/get_cancelled_docs' + '/' + inn);
  }

  cashtanGetPep(inn: string) {
    return this.http.get<any>(this.ubkiUrl + '/get_pep_info' + '/' + inn);
  }

  getCashtanCash(inn: string) {
    return this.http.get<any>(
      this.cashtanDbDataUrl + '/get_cashflow' + '/' + inn
    );
  }

  getCashtanCash_Long(inn: string) {
    return this.http.get<number>(
      this.cashtanDbDataUrl + '/get_closed_long_loans_count' + '/' + inn
    );
  }

  getCashtanClosed(inn: string) {
    return this.http.get<number>(
      this.cashtanDbDataUrl + '/get_closed_long_loans_count' + '/' + inn
    );
  }

  getCashtanTrue(inn: string) {
    return this.http.get<any>(
      this.cashtanDbDataUrl + '/get_is_user_open_credit' + '/' + inn
    );
  }

  getCashtanBlack(inn: string) {
    return this.http.get<any>(
      this.cashtanDbDataUrl + '/get_is_user_in_sl' + '/' + inn
    );
  }

  cashtanFinApi(inn: string) {
    return this.http.get<FinApiCashtan>(
      this.cashtanDbDataUrl + '/get_user_data_for_finapi' + '/' + inn
    );
  }

  getCancelledDocs(inn: string) {
    return this.http.get<CanceledDocs>(
      this.ubkiUrl + '/get_cancelled_docs' + '/' + inn
    );
  }

  getProperty(inn: string) {
    const params = new HttpParams().set('client_inn', inn);
    return this.http.get<any>(
      this.clientObjectsUrl + '/property' + '/additional' + '/' + 0,
      { params }
    );
  }

  getAuto(inn: string) {
    const params = new HttpParams().set('client_inn', inn);
    return this.http.get<any>(
      this.clientObjectsUrl + '/auto' + '/additional' + '/' + 0,
      { params }
    );
  }

  military(inn: string) {
    return this.http.get<any>(this.url + '/is_military' + '/' + inn);
  }

  banned(inn: string) {
    return this.http.get<any>(this.url + '/is_user_banned' + '/' + inn);
  }

  isClientGone(inn: string) {
    return this.http.get<any>(this.url + '/get_is_client_gone' + '/' + inn);
  }

  creditTable(inn: string) {
    return this.http.get<any>(this.url + '/get_credits_data' + '/' + inn);
  }

  openCredit(inn: string) {
    return this.http.get<any>(
      this.url + '/is_user_has_opened_credit' + '/' + inn
    );
  }

  weekCredit(inn: string) {
    return this.http.get<any>(
      this.url + '/is_user_has_closed_week_credit' + '/' + inn
    );
  }

  cashflow(inn: string) {
    return this.http.get<any>(
      this.url + '/get_user_cashflow_clean' + '/' + inn
    );
  }

  risk(inn: string) {
    return this.http.get<any>(this.url + '/get_user_risk_scoring' + '/' + inn);
  }

  bki(inn: string) {
    return this.http.get<BKI>(this.url + '/get_user_bki_info' + '/' + inn);
  }

  payment(inn: string) {
    return this.http.get<any>(this.url + '/get_user_payment_delay' + '/' + inn);
  }

  contact(inn: string) {
    return this.http.get<Contactable>(
      this.url + '/get_is_user_contactable' + '/' + inn
    );
  }

  inNkCredits(inn: string) {
    return this.http.get<IncomeAndNcsCredits>(
      this.url + '/get_user_income_and_ncs_credits' + '/' + inn
    );
  }

  asepReq(inn: string) {
    return this.http.get<ReqAsep>(this.url + '/get_user_asep_info' + '/' + inn);
  }

  court(inn: string) {
    return this.http.get<any>(this.url + '/get_court_data' + '/' + inn);
  }

  getRequestLog(
    ipn: string,
    asepInfo: ReqAsep | undefined,
    bannedUser: boolean,
    openCredit: boolean,
    bkiInfo: BKI | undefined,
    cashflowClean: number,
    getContactable: Contactable | undefined,
    courtData: CourtData | undefined,
    getIncomeNcsCredits: IncomeAndNcsCredits | undefined,
    paymentDelay: number,
    riskScoring: number,
    weekCredit: boolean
  ) {
    const body = {
      user_inn: ipn,
      is_banned: bannedUser,
      is_user_has_opened_credit: openCredit,
      is_user_has_closed_week_credit: weekCredit,
      get_user_cashflow_clean: cashflowClean,
      get_user_risk_scoring: riskScoring,
      get_user_bki_info: bkiInfo,
      get_user_asep_info: asepInfo,
      get_is_user_contactable: getContactable,
      get_court_data: courtData,
      get_user_income_and_ncs_credits: getIncomeNcsCredits,
      get_user_payment_delay: paymentDelay,
    };

    return this.http.post<any>(`${this.url}/create_request_log`, body);
  }

  finApiRequest(params: HttpParams) {
    return this.http.get<any>(this.finapiUrl + '/fin_api_request', { params });
  }
}
