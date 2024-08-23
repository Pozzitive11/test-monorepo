import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  SubordinatesUser,
  UserFromDB,
  UserInfo,
  UserLead,
  UserLogin,
  UserManager,
  UserRole,
} from '../models/user.model';
import {
  CallType,
  Contragent,
  DeletedMonitoringInfo,
  Fine,
  Mark,
  MonitoringInfo,
  Nks,
  Operator,
  Penalty,
  Recruiter,
  Score,
  SelectList,
  Supervisor,
} from '../models/monitoring.models';
import {
  Call,
  CallSearchParameters,
  ChildRecords,
} from '../models/calls.model';
import { MessageHandlingService } from '../../../shared/services/message-handling.service';
import { UtilFunctions } from '../../../shared/utils/util.functions';

@Injectable({
  providedIn: 'root',
})
export class QualityHttpService {
  private readonly http = inject(HttpClient);

  private readonly messageService = inject(MessageHandlingService);
  private readonly url =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    environment.quality_control;

  private readonly callcenterUrl =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    environment.cc_api_url;

  contragentList() {
    return this.http.get<Contragent[]>(this.url + '/find_list_contragents');
  }

  supervisorsList() {
    return this.http.get<Supervisor[]>(this.url + '/find_list_supervisors');
  }

  specialistList() {
    return this.http.get<Supervisor[]>(this.url + '/find_list_specialists_skk');
  }

  recruitersList() {
    return this.http.get<Recruiter[]>(this.url + '/find_list_recruters');
  }

  operatorsList() {
    return this.http.get<Operator[]>(this.url + '/find_list_operators');
  }

  getUserShortInfo(userId: number) {
    return this.http.get<{ [key: string]: any }>(
      this.url + '/get_user/' + userId
    );
  }

  managersUsersList() {
    return this.http.get<SubordinatesUser[]>(this.url + '/manager_users');
  }

  removeSubordinate(obj: object) {
    return this.http.patch<SubordinatesUser[]>(
      this.url + '/remove_subordinate_user',
      obj
    );
  }

  // updateUser(id: number, object: object) {
  //   return this.http.patch<any>(this.url + '/update_user' + '/' + id, object)
  // }

  fireUser(userId: number) {
    return this.http.patch<UserInfo>(this.url + '/fire_user', { Id: userId });
  }

  getMonitoring(id: number) {
    return this.http.get<MonitoringInfo>(
      this.url + '/get_monitoring' + '/' + id
    );
  }

  deleteMonitoring(id: number) {
    return this.http.delete<DeletedMonitoringInfo>(
      this.url + '/remove_monitoring' + '/' + id
    );
  }

  updateMonitoring(id: number, obj: object) {
    return this.http.patch<MonitoringInfo>(
      this.url + '/update_monitoring' + '/' + id,
      obj
    );
  }

  startMonitoring(object: object) {
    return this.http.post<{ [key: string]: any }[]>(
      this.url + '/monitoring_dynamic_list',
      object
    );
  }

  startReportByGpa(object: object) {
    return this.http.post<any>(this.url + '/report_by_gpa', object);
  }

  startReportByPeriod(object: object) {
    return this.http.post<any>(this.url + '/report_by_period', object);
  }

  createUserManager(object: object) {
    return this.http.post<UserManager>(
      this.url + '/create_user_manager',
      object
    );
  }

  updateUserManager(object: object) {
    return this.http.patch<UserManager>(
      this.url + '/update_user_manager',
      object
    );
  }

  updateUserProbation(employeeId: number, probationStatus: boolean) {
    return this.http.patch<UserInfo>(
      this.url + '/update_users_probation/' + employeeId,
      {
        Probation: probationStatus,
      }
    );
  }

  updateUserRole(employeeId: number, userRoleId: number) {
    return this.http.patch<UserInfo>(
      this.url + '/update_users_role/' + employeeId,
      { RoleId: userRoleId }
    );
  }

  // Penalties sheet
  getMonitoringPenalties(id_list: number) {
    return this.http.get<Penalty[]>(
      this.url + '/get_monitoring_penalties' + '/' + id_list
    );
  }
  createMonitoringPenalty(object: object) {
    return this.http.post<Penalty>(
      this.url + '/create_monitoring_penalty',
      object
    );
  }
  updateMonitoringPenalty(mod_id: any, object: object) {
    return this.http.patch<Penalty>(
      this.url + '/update_monitoring_penalty' + '/' + mod_id,
      object
    );
  }
  deleteMonitoringPenalty(mod_id: any) {
    return this.http.delete<Penalty>(
      this.url + '/remove_monitoring_penalty' + '/' + mod_id
    );
  }
  //
  updateRowMonitoringTable(mod_id: any, object: object) {
    return this.http.patch<Mark>(
      this.url + '/update_monitoring_dictionary' + '/' + mod_id,
      object
    );
  }

  createRowMonitoringTable(object: object) {
    return this.http.post<Mark>(
      this.url + '/create_monitoring_dictionary',
      object
    );
  }

  deleteRowMonitoringTable(mod_id: any) {
    return this.http.delete<Mark>(
      this.url + '/remove_monitoring_dictionary' + '/' + mod_id
    );
  }
  // CREATE USER
  getUsersList() {
    return this.http.get<UserLogin[]>(this.url + '/collect_user_logins');
  }
  getRolesList() {
    return this.http.get<UserRole[]>(this.url + '/user_roles');
  }
  getLeadsList() {
    return this.http.get<UserLead[]>(this.url + '/user_managers');
  }
  getAllMonitoringDictionaries(id_list: number) {
    return this.http.get<Mark[]>(
      this.url + '/all_monitoring_dictionaries' + '/' + id_list
    );
  }
  //
  // loginListTwice() {
  //   return this.http.get<any>(this.url + '/show_user_logins')
  // }
  // CREATE MONITORING
  getNksList(nks: number) {
    const params = new HttpParams().set('nks_id', nks);
    return this.http.get<Nks>(this.url + '/find_nks', { params });
  }

  getCallResultList(list_type_id: number, contact: string) {
    const params = new HttpParams()
      .set('list_type_id', list_type_id)
      .set('name_contact_with', contact);
    return this.http.get<SelectList[]>(this.url + '/find_list_call_result', {
      params,
    });
  }
  //
  getAllUsers() {
    return this.http.get<UserFromDB[]>(this.url + '/all_users');
  }

  getFindListContact() {
    return this.http.get<SelectList[]>(this.url + '/find_list_contact_with');
  }

  getFindListCallLength() {
    return this.http.get<SelectList[]>(this.url + '/find_list_call_length');
  }

  getCallTypes() {
    return this.http.get<SelectList[]>(
      this.url + '/find_list_call_description'
    );
  }

  // getFindListChecked(listId: number) {
  //   return this.http.get<any>(this.url + '/all_monitoring_dictionaries' + '/' + listId)
  // }

  getFindListDiscount() {
    return this.http.get<SelectList[]>(
      this.url + '/find_list_restruct_discount'
    );
  }

  getFindListCallProblem() {
    return this.http.get<SelectList[]>(this.url + '/find_list_call_problem');
  }

  getFindListType(list_type_id: number) {
    const params = new HttpParams().set('list_type_id', list_type_id);
    return this.http.get<CallType[]>(this.url + '/find_list_call_type', {
      params,
    });
  }

  // getFindCallHR(list_type_id: number) {
  //   const params = new HttpParams().set('list_type_id', list_type_id)
  //   return this.http.get<any>(this.url + '/find_list_call_result', { params })
  // }

  downloadFile(reportType: string, start: string, end: string, jsoon: any) {
    let objDown = {
      report_type: reportType,
      start_date: start,
      end_date: end,
      data: jsoon,
    };
    this.http
      .post<Blob>(this.url + '/download_last_report', objDown, {
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (file) => UtilFunctions.downloadXlsx(file, reportType, null),
        error: async (error) => {
          this.messageService.sendError(
            JSON.parse(await error.error.text).detail
          );
        },
      });
  }

  createUser(object: object) {
    return this.http.post<UserInfo>(this.url + '/create_user', object);
  }

  lastMonitoringUser(
    listTypeId: number | null,
    idUser: number | null,
    idMonitoring: number | null
  ) {
    const body = {
      list_type_id: listTypeId,
      user_id: idUser,
      monitoring_id: idMonitoring,
    };
    return this.http.post<{ [key: string]: any }>(
      this.url + '/show_last_user_monitoring',
      body
    );
  }

  sendMonit(object: any) {
    return this.http.post<MonitoringInfo>(
      this.url + '/create_monitoring',
      object
    );
  }

  sendScoreId(object: object) {
    return this.http.post<Score>(
      this.url + '/create_monitoring_scores',
      object
    );
  }
  sendPenaltiesId(object: object) {
    return this.http.post<Fine>(this.url + '/create_monitoring_fines', object);
  }

  removeScoreId(object: object) {
    return this.http.delete<Score>(this.url + '/remove_monitoring_scores', {
      body: object,
    });
  }
  removePenaltyId(object: object) {
    return this.http.delete<Fine>(this.url + '/remove_monitoring_fines', {
      body: object,
    });
  }

  getMonitListforMonitId(id: number) {
    const params = new HttpParams().set('monitoring_id', id);
    return this.http.get<Score[]>(this.url + '/get_monitoring_scores_list', {
      params,
    });
  }
  getMonitoringPenaltiesList(listType: number) {
    return this.http.get<Penalty[]>(
      this.url + '/get_monitoring_penalties/' + listType
    );
  }
  getMonitoringPenaltyListByMonitId(id: number) {
    const params = new HttpParams().set('monitoring_id', id);
    return this.http.get<Fine[]>(this.url + '/get_monitoring_penalty_list', {
      params,
    });
  }

  deleteUser(id: number) {
    return this.http.delete<UserInfo>(this.url + '/remove_user' + '/' + id);
  }

  // ----------------------------------------------- CALLS
  getCallRecords(callSearchParams: CallSearchParameters) {
    return this.http.post<Call[]>(
      `${this.url}/parent_audio_records`,
      callSearchParams
    );
  }

  getChildRecords(recordId: string) {
    const params = new HttpParams().set('record_id', recordId);
    return this.http.get<ChildRecords[][]>(`${this.url}/child_audio_records`, {
      params: params,
    });
  }

  getRecordFile(filePath: string[], silencePosition: string) {
    const params = new HttpParams().set('silence_position', silencePosition);
    return this.http.post<Blob>(`${this.url}/processed_audio_file`, filePath, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params,
    });
  }
}
