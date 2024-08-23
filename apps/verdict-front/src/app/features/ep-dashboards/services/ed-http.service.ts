import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { ICachedReportInfoModel } from '../models/cached-report-info.model'
import { AllEpData } from '../models/ed-all-data.model'
import { TTable } from '../../../shared/models/basic-types'

@Injectable({
  providedIn: 'root'
})
export class EdHttpService {
  private readonly http = inject(HttpClient)

  private readonly url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.ep_dashboard_api_url

  loadAuctionData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=NEW_Auction&limit=0'
    )
  }

  loadAllEpData() {
    return this.http.get<AllEpData>(
      this.url + '/all_ep_report/get_all_ep_counts'
    )
  }

  loadAllEpWpData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Enforcement_Proceedings&limit=0'
    )
  }

  loadDeptData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Zam_Debt&limit=0'
    )
  }

  loadDfsData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=CeckDFS_Debt&limit=0'
    )
  }

  loadFirstData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Property_Description&limit=0'
    )
  }

  loadActuallyData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=EP_Final_Type&limit=0'
    )
  }

  loadPaymentsData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Payments_Do_Zam_VP_Debt&limit=0'
    )
  }

  loadWpData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Payments_To_Zam_VP_Debt&limit=0'
    )
  }

  loadAvansData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Avans_Return&limit=0'
    )
  }

  loadSlData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Payments_DC_SL&limit=0'
    )
  }

  loadFactSlData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=Payments_FACT_VP_SL&limit=0'
    )
  }

  loadAuctionNotData() {
    return this.http.get<TTable>(
      this.url + '/raw_sql/execute?name=NEW_Auction_Not_3_4&limit=0'
    )
  }


  loadAllEpCountInfo(
    checked: boolean = false,
    known: boolean = false,
    buffer: boolean = false,
    ended: boolean = false,
    active: boolean = false
  ) {
    const params = new HttpParams()
      .set('checked', checked)
      .set('known', known)
      .set('buffer', buffer)
      .set('ended', ended)
      .set('active', active)

    return this.http.get<number>(
      this.url + '/all_ep_report/count',
      { params }
    )
  }

  loadAllEpWithStatusCountInfo(
    epStatus: 'active' | 'ended' | 'buffer',
    notOurDebtor: boolean,
    ourEp: boolean,
    notOurs: boolean,
    creditorsEp: boolean,
    unknownDebtor: boolean
  ) {
    const params = new HttpParams()
      .set('not_our_debtor', notOurDebtor)
      .set('our_ep', ourEp)
      .set('not_ours', notOurs)
      .set('creditors_ep', creditorsEp)
      .set('unknown_debtor', unknownDebtor)

    return this.http.get<number>(
      this.url + `/all_ep_report/count/by_status/${epStatus}`,
      { params }
    )
  }

  loadAllEpCountCreditorsEp(
    epStatus: 'active' | 'ended',
    epState: 'before' | 'after' | 'other',
    notOurs: boolean,
    noSideChange: boolean,
    sideChanged: boolean
  ) {
    const params = new HttpParams()
      .set('not_ours', notOurs)
      .set('no_side_change', noSideChange)
      .set('side_changed', sideChanged)

    return this.http.get<number>(
      this.url + `/all_ep_report/count/creditors_ep/${epStatus}/${epState}`,
      { params }
    )
  }

  reportToExcel(data: TTable, reportName: string) {
    return this.http.post(
      this.url + '/report_data_to_excel',
      {
        ReportData: data,
        ReportName: reportName
      },
      { responseType: 'blob' }
    )
  }

  getRawSqlNames() {
    return this.http.get<string[]>(this.url + '/raw_sql/names')
  }

  getCachedReports() {
    return this.http.get<ICachedReportInfoModel[]>(this.url + '/raw_sql/cached_reports')
  }

  deleteCachedReport(key: string) {
    return this.http.delete<ICachedReportInfoModel[]>(this.url + `/raw_sql/cached_reports/${key}`)
  }

  reloadCachedReport(key: string) {
    return this.http.get<ICachedReportInfoModel>(this.url + `/raw_sql/cached_reports/reload/${key}`)
  }

  loadReportToCache(reportName: string, limit: number = 0) {
    const params = new HttpParams()
      .set('limit', limit)

    return this.http.get<ICachedReportInfoModel[]>(this.url + `/raw_sql/cached_reports/load/${reportName}`, { params })
  }
}
