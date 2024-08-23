import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { ServerBasicResponse } from '../../../data-models/server-data.model'
import {
  BucketsToSaveModel,
  DictionaryModel,
  InputCCMailsModel,
  InputFilterParameters,
  InputProjectEPReturns,
  InputProjectParameters,
  InputReestrFromInvestProjects,
  InputReestrParameters,
  InputSegmentation,
  InputTimePlanFact,
  IntersectionsINNFilters,
  InvestProjectsModel,
  ManagerFilterModel,
  ProjectFilterModel,
  ReestrFilterModel
} from '../models/filters.model'
import {
  CCMailsModel,
  EverydayCCWorkModel,
  IncomeModel,
  IntersectionsINNModel,
  PhonesSegmentationPivotModel,
  PlansInfoModel,
  ProjectEPReturns,
  rangeTuple,
  RpcNcInfoInputData,
  RpcNcInfoInputDataFromContracts,
  RPCNCInfoModel,
  RpcNcInfoModelWithHead,
  SegmentationModel,
  SegmentsRPCNC,
  TimePlanFactReport
} from '../models/report-models'

@Injectable({
  providedIn: 'root'
})
export class CcHttpClientService {
  private http = inject(HttpClient)

  url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.cc_api_url

  // ---------------------------------------------------------------------------------------- FILTERS RELATED
  // ----------------------------------------------- PROJECTS RELATED

  getProjectManagers() {
    return this.http.get<ManagerFilterModel[]>(this.url + '/get_project_managers')
  }

  getProjects(input_data: InputProjectParameters) {
    return this.http.post<ProjectFilterModel[]>(this.url + '/get_projects', input_data)
  }

  getInvestProjects() {
    return this.http.get<InvestProjectsModel[]>(this.url + '/invest_projects_filter')
  }

  // ----------------------------------------------- REESTR RELATED

  getReestrs(input_data: InputReestrParameters) {
    return this.http.post<ReestrFilterModel[]>(this.url + '/reestr_filter', input_data)
  }

  getReestrStatuses() {
    return this.http.get<DictionaryModel[]>(this.url + '/reestr_status_filter')
  }

  getReestrTypes() {
    return this.http.get<DictionaryModel[]>(this.url + '/reestr_type_filter')
  }

  getReestrsFromInvestProjects(input_data: InputReestrFromInvestProjects) {
    return this.http.post<ReestrFilterModel[]>(this.url + '/reestrs_from_invest_projects_filter', input_data)
  }

  // ----------------------------------------------- OTHER FILTERS

  getExcludedLogins(year: number, month: number) {
    return this.http.post<string[]>(this.url + '/get_excluded_logins_filter', { Year: year, Month: month })
  }

  // ---------------------------------------------------------------------------------------- FILTERS RELATED

  // ---------------------------------------------------------------------------------------- REPORTS RELATED

  getSegmentsRpcNcReport(input_data: InputSegmentation) {
    return this.http.post<SegmentsRPCNC[]>(this.url + '/cc_segments_rpc_nc', input_data)
  }

  getSegmentsRpcNcTotals() {
    return this.http.get<RPCNCInfoModel[]>(this.url + '/cc_segments_rpc_nc_total')
  }

  getEverydayCCWorkReport(input_data: InputFilterParameters) {
    return this.http.post<EverydayCCWorkModel[]>(this.url + '/cc_ed_work', input_data)
  }

  getIncomeReport(input_data: InputFilterParameters) {
    return this.http.post<IncomeModel[]>(this.url + '/cc_income', input_data)
  }

  getIntersectionsINNReport(input_data: IntersectionsINNFilters) {
    return this.http.post<IntersectionsINNModel[]>(this.url + '/cc_intersections_inn', input_data)
  }

  getCCMailsReport(input_data: InputCCMailsModel) {
    return this.http.post<CCMailsModel[]>(this.url + '/cc_mails', input_data)
  }

  getProjectEpReturnsReport(input_data: InputProjectEPReturns) {
    return this.http.post<ProjectEPReturns[]>(this.url + '/cc_project_ep_returns', input_data)
  }

  getCCTimePlanFactReport(input_data: InputTimePlanFact) {
    return this.http.post<TimePlanFactReport>(this.url + '/cc_time_plan_fact_report', input_data)
  }

  // ----------------------------------------------- SEGMENTATION REPORT
  getCCSegmentationReport(input_data: InputSegmentation) {
    return this.http.post<SegmentationModel[]>(this.url + '/cc_segmentation_report', input_data)
  }

  saveBuckets(buckets: BucketsToSaveModel) {
    return this.http.post<boolean>(this.url + '/save_buckets', buckets)
  }

  getBuckets(bucketsType: string) {
    return this.http.get<string[]>(this.url + '/get_buckets/' + bucketsType)
  }

  // ----------------------------------------------- SEGMENTATION REPORT
  // ---------------------------------------------------------------------------------------- REPORTS RELATED

  getRpcNcInfoFromContracts(inputData: RpcNcInfoInputDataFromContracts) {
    return this.http.post<RpcNcInfoModelWithHead>(this.url + '/get_rpc_nc_info_from_contracts', inputData)
  }

  getCcPhoneSegmentation(inputData: RpcNcInfoInputData) {
    return this.http.post<ServerBasicResponse>(this.url + '/get_cc_phone_segmentation', inputData)
  }

  downloadPhonesFromContracts(contractIds: number[]) {
    return this.http.post<Blob>(this.url + '/download_contract_phones', contractIds, { responseType: 'blob' as 'json' })
  }

  downloadPhones(contracts: { contract: number; phone: string }[]) {
    return this.http.post<Blob>(this.url + '/download_phones', contracts, { responseType: 'blob' as 'json' })
  }

  uploadTimePlans(formData: FormData) {
    return this.http.post<ServerBasicResponse>(this.url + '/upload_time_plans', formData)
  }

  getTimePlans() {
    return this.http.get<PlansInfoModel[]>(this.url + '/get_time_plans')
  }

  serverPivotPhonesData(data: { selectedPhoneStatuses: string[]; pivotSegments: rangeTuple[] }) {
    return this.http.post<PhonesSegmentationPivotModel>(this.url + '/pivot_cc_phone_segmentation', data)
  }
}
