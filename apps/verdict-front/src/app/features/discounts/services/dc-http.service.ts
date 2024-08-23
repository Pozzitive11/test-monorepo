import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { environment } from '../../../../environments/environment'
import { ServerBasicResponse } from '../../../data-models/server-data.model'
import { UserSearchModel } from '../../../shared/models/user-search.model'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { dcAgreeInfoType } from '../models/dc-agree-info.type'
import { ScoreModel } from '../models/dc-basic-models'
import { ClientPromotionInfoModel, Currency } from '../models/dc-client-promotion-info-model'
import { DcClientPromotionUpdateModel } from '../models/dc-client-promotion-update-model'
import { DcMilitaryDocsTableChanges } from '../models/dc-military-docs-table-changes'
import { DcPromotionDocsRequestsInfoModel } from '../models/dc-promotion-docs-requests-info.model'
import { DcPromotionForDocsModel } from '../models/dc-promotion-for-docs.model'
import { DcPromotionSimpleWithDocsReqModel } from '../models/dc-promotion-simple-with-docs-req.model'
import { DcPromotionSimpleModel } from '../models/dc-promotion-simple.model'
import { DctDataType } from '../models/dc-template-models/dct-data.type'
import { DctGuaranteeLetterDataModel } from '../models/dc-template-models/dct-guarantee-letter-data.model'
import { DctGuaranteeLetterInputDataModel } from '../models/dc-template-models/dct-guarantee-letter-input-data.model'
import { DctInformLetterDataModel } from '../models/dc-template-models/dct-inform-letter-data.model'
import { DctInputWritingOffDataModel } from '../models/dc-template-models/dct-input-writing-off-data.model'
import { DctRefNumberModel } from '../models/dc-template-models/dct-ref-number.model'
import {
  dctBuildEndPointsMap,
  dctTypesShortEnum,
  dctTypesShortValues
} from '../models/dc-template-models/dct-types.enum'

import { DctAbstractDataModel } from '../models/dc-template-models/dct-abstract.data.model'
import { DctAbstarctInputDataModel } from '../models/dc-template-models/dct-abstract-input-data.model'
import { DctWritingOffDataModel } from '../models/dc-template-models/dct-writing-off-data.model'
import { Observable } from 'rxjs'
import { DcClosingCertificate, DcClosingCertificateToSave } from '../models/dc-create-closing-certificate.model'
import { DcFillClosingCertificateTemplateData } from '../models/dc-closing-certificates'
import { Document } from '../../documentation/models/documentation.model'
import { MilitaryDocument } from '../models/dc-military-tree.model'

type DcTemplateListItem = { id: number; docType: dctTypesShortValues }

@Injectable({
  providedIn: 'root'
})
export class DcHttpService {
  private readonly http = inject(HttpClient)

  private readonly url =
    (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.discounts_api_url

  buildScoreModel(contractId: number) {
    return this.http.get<ScoreModel[]>(this.url + '/score_model/' + contractId)
  }

  uploadMilitaryDoc(formData: FormData, INN: string, docTypeId: number, isSpouse: boolean) {
    const params = new HttpParams().set('is_spouse', isSpouse)
    return this.http.post<ServerBasicResponse>(this.url + '/military_doc/' + INN + '/' + docTypeId, formData, {
      params
    })
  }

  getMilitaryDocTypes(isActual: boolean) {
    const params = new HttpParams().set('is_actual', isActual)
    return this.http.get<{ id: number; name: string }[]>(this.url + '/military_doc_types', { params })
  }

  getMilitaryDocTree() {
    return this.http.get<{ [key: string]: any }[]>(this.url + '/doc_dictionary_tree')
  }

  getAllMilitaryDocs() {
    return this.http.get<{ [key: string]: any }[]>(this.url + '/military_docs')
  }

  getClientsHistory(nks: number[]) {
    return this.http.post<{ [key: string]: any }[]>(this.url + '/client_promotions_history', nks)
  }

  uploadOtherDocs(formData: FormData, INN: string, type: number | string | 'NULL') {
    return this.http.post<ServerBasicResponse>(this.url + '/other_doc/' + INN + '/' + type, formData)
  }

  uploadOtherDocs_Identi(formData: FormData, INN: string, type: number | string | 'NULL') {
    return this.http.post<ServerBasicResponse>(this.url + '/other_doc/' + INN + '/' + type, formData)
  }

  uploadMilitaryUnitResponse(formData: FormData, INN: string) {
    return this.http.post<ServerBasicResponse>(this.url + '/military_unit_response/' + INN, formData)
  }

  addNewClientPromotion(confirmedChosenConditions: ClientPromotionInfoModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/client_promotion', confirmedChosenConditions)
  }

  getCurrencyDictionary() {
    return this.http.get<Currency[]>(this.url + '/currency_dictionary')
  }

  getPromotionsDates() {
    return this.http.get<{ MinDate: string; MaxDate: string }>(this.url + '/promotions_dates')
  }

  getSendingDocs() {
    return this.http.get<{ [key: string]: any }[]>(this.url + '/get_all_doc_approved_promotions')
  }

  getClientsPromotions(
    onlyNew: boolean,
    useNewInfo: boolean,
    dateFilter: { minDate: string | null; maxDate: string | null },
    getCalculations: boolean
  ) {
    const params = new HttpParams()
      .set('only_new', onlyNew)
      .set('min_date', dateFilter.minDate ? dateFilter.minDate : '')
      .set('max_date', dateFilter.maxDate ? dateFilter.maxDate : '')
      .set('use_new_info', useNewInfo)
      .set('get_calculations', getCalculations)

    return this.http.get<{ [key: string]: any }[]>(this.url + '/clients_promotions', { params })
  }

  getClientsPromotionsFromContractsList(
    contractsList: string,
    useNewInfo: boolean,
    selectLatestOnly: boolean,
    getCalculations: boolean
  ) {
    const params = new HttpParams()
      .set('use_new_info', useNewInfo)
      .set('select_latest_only', selectLatestOnly)
      .set('get_calculations', getCalculations)

    return this.http.post<{ [key: string]: any }[]>(
      this.url + '/clients_promotions_from_contracts',
      { data: contractsList },
      { params }
    )
  }

  getClientPromotionsInfo(contractId?: number, clientINN?: string) {
    const params = new HttpParams()
      .set('contract_id', contractId ? contractId : '')
      .set('client_inn', clientINN ? clientINN : '')

    return this.http.get<any[]>(this.url + '/client_promotions_info', { params })
  }

  updateClientPromotion(dataUpdate: DcClientPromotionUpdateModel) {
    return this.http.patch<ServerBasicResponse>(this.url + '/client_promotion', dataUpdate)
  }

  sendToAgreement(ids: number[], getCalculations: boolean) {
    const params = new HttpParams().set('get_calculations', getCalculations)

    return this.http.post<Blob>(this.url + '/send_to_agreement', ids, { responseType: 'blob' as 'json', params })
  }

  makeExcelPromotions(ids: number[], useNewInfo: boolean, getCalculations: boolean) {
    return this.http.post<Blob>(
      this.url + '/make_excel_for_promotions',
      { ids, useNewInfo, getCalculations },
      { responseType: 'blob' as 'json' }
    )
  }

  makeExcelDocuments(inns: string[]) {
    return this.http.post<Blob>(this.url + '/military_docs_excel', inns, { responseType: 'blob' as 'json' })
  }

  markAgreed(ids: number[], useNewInfo: boolean, agreeInfo: dcAgreeInfoType) {
    return this.http.post<ServerBasicResponse>(this.url + '/mark_agreed', { ids, agreeInfo, useNewInfo })
  }

  changeDocType(change: { docType: number | string; id: number }) {
    return this.http.patch(this.url + '/doc_type', change)
  }

  changeDocInfo(change: DcMilitaryDocsTableChanges) {
    return this.http.patch(this.url + '/doc_info', change)
  }

  deleteClientDoc(docId: number) {
    return this.http.delete<ServerBasicResponse>(this.url + '/client_doc/' + docId)
  }

  getClientName(clientINN: string) {
    return this.http.get<string>(this.url + '/client_name/' + clientINN)
  }

  loadOperators() {
    return this.http.get<UserSearchModel[]>(this.url + '/operators')
  }

  // ========================================= Promotions info (templates) =========================================

  getContractPromotion(contractId: number) {
    return this.http.get<DcPromotionForDocsModel>(this.url + `/contract_promotions/${contractId}`)
  }

  getClientsPromotionsFromIds(ids: number[]) {
    return this.http.post<{ [key: string]: any }[]>(this.url + '/clients_promotions_from_ids', ids)
  }

  getTemplatesList(cp_ids: number[], selected_docs: string[], can_be_repeated: boolean = false) {
    return this.http.post<DcTemplateListItem[]>(this.url + '/templates_list_for_ids', {
      cp_ids,
      selected_docs,
      can_be_repeated
    })
  }

  getContractPromotionsForRefNumber(contractId: number) {
    return this.http.get<DcPromotionSimpleModel[]>(this.url + `/contract_promotions_for_ref_number/${contractId}`)
  }

  // ========================================= Documents requests =========================================

  saveDocumentsRequest(request: DcPromotionForDocsModel) {
    return this.http.post<ServerBasicResponse>(this.url + '/documents_request', request)
  }

  loadDocsRequestsInfo() {
    return this.http.get<DcPromotionDocsRequestsInfoModel>(this.url + '/document_requests_info')
  }

  loadDocsRequests(offset: number, limit: number, only_new: boolean) {
    const params = new HttpParams().set('only_new', only_new).set('offset', offset).set('limit', limit)

    return this.http.get<DcPromotionSimpleWithDocsReqModel[]>(this.url + '/document_requests', { params })
  }

  checkDocumentRequests(reqIds: number[]) {
    return this.http.patch<ServerBasicResponse>(this.url + '/check_document_requests', reqIds)
  }

  // ========================================= Templates =========================================

  getClientsPromotionsForTemplates(
    dateFilterStr: { fromDate: string | null; toDate: string | null },
    selectedDocumentTypes: string[]
  ) {
    const params = new HttpParams()
      .set('from_date', dateFilterStr.fromDate ? dateFilterStr.fromDate : '')
      .set('to_date', dateFilterStr.toDate ? dateFilterStr.toDate : '')

    return this.http.post<DctWritingOffDataModel[]>(
      this.url + '/clients_promotions_for_templates',
      selectedDocumentTypes,
      { params }
    )
  }

  downloadZipArchive(ids: number[], params: HttpParams) {
    return this.http.post<Blob>(this.url + '/get_built_templates_zip', ids, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    })
  }

  uploadShippingDocs(
    full_name: string,
    cp_id: number,
    shippingDate: string,
    file: FormData | null,
    doc_type: string,
    contractId: number
  ): Observable<any> {
    const params = {
      cp_id,
      shipping_date: shippingDate,
      full_name,
      doc_type,
      contract_id: +contractId
    }

    return this.http.post<any[]>(this.url + '/upload_shipping_confirmation_doc', file, {
      params
    })
  }

  downloadTemplates(formData: FormData, saveFiles: boolean) {
    const params = new HttpParams().set('save_files', saveFiles)

    return this.http.post<Blob>(this.url + '/download_built_templates', formData, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    })
  }

  buildTemplate(template: DctDataType, templateType: dctTypesShortEnum) {
    const endPoint = dctBuildEndPointsMap.get(templateType)
    if (!endPoint) throw new Error(`No endpoint for template type ${templateType}`)
    return this.http.post<Blob>(this.url + `/${endPoint}`, template, {
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  // ---------------------------- Writing off ----------------------------

  fillWritingOffTemplateData(inputTemplateData: DctInputWritingOffDataModel[]) {
    return this.http.post<DctWritingOffDataModel[]>(this.url + '/fill_agreement_template_data', inputTemplateData)
  }

  saveWritingOffTemplates(dataModels: DctWritingOffDataModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/agreement_templates_to_db', dataModels)
  }

  // ---------------------------- ABSTRACT ----------------------------

  fillAbstractTemplateData(inputTemplateData: DctAbstarctInputDataModel[]) {
    const promotionIds = inputTemplateData.map((data) => data.PromotionId)

    return this.http.post<DctAbstractDataModel[]>(this.url + '/fill_abstract_template_data', promotionIds)
  }

  saveAbstractTemplates(dataModels: DctAbstractDataModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/abstract_templates_to_db', dataModels)
  }

  // ---------------------------- Inform letters ----------------------------

  loadInformLetterTemplate(promotionIds: number[]) {
    return this.http.post<DctInformLetterDataModel[]>(this.url + '/fill_inform_letter_data', promotionIds)
  }

  saveInformLetters(dataModels: DctInformLetterDataModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/inform_letter_templates_to_db', dataModels)
  }

  // ---------------------------- Guarantee letters ----------------------------

  fillGuaranteeLetterTemplateData(inputTemplateData: DctGuaranteeLetterInputDataModel[]) {
    return this.http.post<DctGuaranteeLetterDataModel[]>(this.url + '/fill_guarantee_letter_data', inputTemplateData)
  }

  saveGuaranteeLetters(dataModels: DctGuaranteeLetterDataModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/guarantee_letter_templates_to_db', dataModels)
  }

  // ---------------------------- Ref numbers ----------------------------

  resetLatestRefNumber(refNumber: string, company: string) {
    const params = new HttpParams().set('ref_number', refNumber).set('company', company)

    return this.http.get<ServerBasicResponse>(this.url + '/reset_latest_ref_number', { params })
  }

  getRefNumberCompanies() {
    return this.http.get<string[]>(this.url + '/ref_number_companies')
  }

  getRefNumbersJournalExcel(
    companies: string[],
    journalDateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null }
  ) {
    const fromDate = UtilFunctions.formatNgbDate(journalDateFilter.fromDate, '%Y-%m-%d')
    const toDate = UtilFunctions.formatNgbDate(journalDateFilter.toDate, '%Y-%m-%d')

    const params = new HttpParams().set('from_date', fromDate).set('to_date', toDate)

    return this.http.post<Blob>(this.url + '/ref_numbers_to_excel', companies, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    })
  }

  insertNewRefNumber(newRefNumber: DctRefNumberModel) {
    if (newRefNumber.RefNumberDate instanceof Date)
      newRefNumber.RefNumberDate = UtilFunctions.formatDate(newRefNumber.RefNumberDate, false, '%Y-%m-%d')
    return this.http.post<ServerBasicResponse>(this.url + '/manual_ref_number', newRefNumber)
  }

  getClosingCertificateInitialInfo(contractId: number) {
    const params = new HttpParams().set('contract_id', contractId)
    return this.http.get<DcClosingCertificate>(this.url + '/closing_certificate_initial_info', { params })
  }

  getSendingWays() {
    return this.http.get<{ id: number; Name: string }[]>(this.url + '/sending_ways_dictionary')
  }

  saveClosingCertificate(closingCertificateInfo: DcClosingCertificateToSave) {
    return this.http.post(this.url + '/client_certificate_request', closingCertificateInfo)
  }

  searchClosingCertificates(isFullClosure: boolean, dates: { minDate: string; maxDate: string }) {
    const params = new HttpParams()
      .append('is_full_closure', isFullClosure)
      .append('min_date', dates.minDate)
      .append('max_date', dates.maxDate)
    return this.http.post<{ [key: string]: any }[]>(this.url + '/client_certificate_requests', null, { params })
  }

  fillClosingCertificateTemplateData(closingCertificateIds: number[]) {
    return this.http.post<DcFillClosingCertificateTemplateData[]>(
      this.url + '/fill_closing_certificate_template_data',
      closingCertificateIds
    )
  }
  buildClosingCertificateTemplate(template: DcFillClosingCertificateTemplateData) {
    return this.http.post<Blob>(this.url + '/build_closing_certificate_template', template, {
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  downloadCertificateTemplates(files: { file: Blob; filename: string }[]) {
    const formData = new FormData()
    files.forEach(({ file, filename }) => {
      formData.append('files', file, filename)
    })

    const params = new HttpParams().set('save_files', true)
    return this.http.post<Blob>(this.url + '/download_built_templates', formData, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    })
  }

  closingCertificateTemplateToDB(template: DcFillClosingCertificateTemplateData[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/closing_certificate_template_to_db', template)
  }
}
