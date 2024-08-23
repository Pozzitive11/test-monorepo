import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { ServerBasicResponse } from '../../../data-models/server-data.model'
import { PEAccountTransactionModel } from '../models/pe-account-transaction.model'
import { PEInfoModel } from '../models/pe-info.model'

@Injectable({
  providedIn: 'root'
})
export class PeHttpService {
  private readonly http = inject(HttpClient)
  private readonly url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.private_entrepreneurs_url

  getPrivateEntrepreneurs() {
    return this.http.get<PEInfoModel[]>(`${this.url}/`)
  }

  getPrivateEntrepreneursById(epId: number) {
    return this.http.get<PEInfoModel>(`${this.url}/one/${epId}`)
  }

  getPrivateEntrepreneurAccountTransactions(accountId: number) {
    return this.http.get<PEAccountTransactionModel[]>(`${this.url}/${accountId}/transactions`)
  }

  disablePrivateEntrepreneur(peId: number) {
    return this.http.get<ServerBasicResponse>(`${this.url}/${peId}/disable`)
  }

  enablePrivateEntrepreneur(peId: number) {
    return this.http.get<ServerBasicResponse>(`${this.url}/${peId}/enable`)
  }

  getPaymentsHistoryByPE(start_date: string, end_date: string, pe_filter: number[]) {
    const params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date)

    return this.http.post<{ [key: string]: number | string | null | Date }[]>(
      `${this.url}/get_payments_history/private_entrepreneurs`,
      pe_filter,
      { params }
    )
  }

  getPaymentsHistoryByAccounts(start_date: string, end_date: string, accounts_filter: number[]) {
    const params = new HttpParams()
      .set('start_date', start_date)
      .set('end_date', end_date)

    return this.http.post<{ [key: string]: number | string | null | Date }[]>(
      `${this.url}/get_payments_history/accounts`,
      accounts_filter,
      { params }
    )
  }

  getTransactionsPeriod() {
    return this.http.get<{ MinDate: string, MaxDate: string }>(`${this.url}/transaction_period`)
  }

  getPaymentTypes() {
    return this.http.get<string[]>(`${this.url}/payment_types`)
  }

  savePaymentType(id: number, paymentType: string) {
    return this.http.patch<ServerBasicResponse>(`${this.url}/payment_type/${id}`, paymentType)
  }
}
