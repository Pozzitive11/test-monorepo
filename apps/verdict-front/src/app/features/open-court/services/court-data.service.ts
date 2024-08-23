import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { data } from 'autoprefixer';
import { CalendarEvent } from 'angular-calendar';


interface CourtResponse {
  count: number;
  courts: Court[];
}

interface Court {
  court_code: number;
  name: string;
}

interface RegionResponse {
  count: number;
  regions: Region[];
}

interface Region {
  region_code: number;
  name: string;
}

interface CategoryResponse {
  count: number;
  categories: Category[];
}

export interface Category {
  category_code: number;
  justice_kind: number;
  name: string;
  checked: boolean;
  count: number;
  categoryCount: number;
}

interface JusticeKindResponse {
  count: number;
  justice_kinds: JusticeKind[];
}

export interface JusticeKind {
  category_code: number;
  justice_kind: number;
  name: string;
  categoryCount: number;
  checked: boolean;
  count: number;
  id: number;
}

export interface ParticipantType {
  id: number;
  name: string;
}



interface ParticipantTypeResponse {
  participant_types: ParticipantType[];
}
 export interface UsersCasesResponse {
  user_cases: UserCasesType[];
}
export interface UserCasesType {
  comments: any;
  userId: number;
  caseNumberId: number;
  id: number;
  renewal: number;
  tag: string;
  showNotifications: boolean;
  meetingDateTime?: number; 
  notifications: Notification[];
  data?: number;
  
}
export interface Notification {
  id: number;
  subscriptionId: number;
  typeDescription: string;
  record: string;
  createdAt: string;
  eventDate: string;
  text: string;
  createdBy: boolean;
}
interface NotificationType {
  date: number;
  type: string;
  description: string;
}



@Injectable({
  providedIn: 'root'
})
export class CourtDataService {
  private http = inject(HttpClient)
  public courtData: any[] = [];
  private notifications: any[] = [];
  private casesData: any[] = []; 
  

  private url: string = 'http://dev.data-factory.ua/open-court-fin'
  private baseUrl = 'http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser';
  


  getInstances(skip = 0, limit = 100): Observable<any> {
    const url = `${this.baseUrl}/get_instances?skip=${skip}&limit=${limit}`;
    return this.http.get<any>(url);
  }
  getDocumentTypes(skip = 0, limit = 100): Observable<any> {
    const url = `${this.baseUrl}/get_judgment_forms?skip=${skip}&limit=${limit}`;
    return this.http.get<any>(url);
  }
  getCourtData(searchCriteria: any,skip = 0, limit = 100) {
    return this.http.post<any>(`${this.url}/api/v0/OpenCourt/get_cases?skip=${skip}&limit=${limit}`, searchCriteria)
  }
  setCasesData(data: any[]) {
    this.casesData = data;
  }

  getCasesData(): any[] {
    return this.casesData;
  }
 


 
  getParticipantTypes(skip: number = 0, limit: number = 1000): Observable<ParticipantType[]> {
    return this.http.get<ParticipantTypeResponse>(`${this.url}/api/v0/OpenCourt/get_participant_types?skip=${skip}&limit=${limit}`)
      .pipe(
        map(response => response.participant_types)
      );
  }
  exportToExcel(courtDataList: any): Observable<Blob> {
    // Обработка данных из searchCriteria и формирование запроса к эндпоинту для скачивания данных в формате Excel
    return this.http.post(`${this.url}/api/v0/OpenCourt/download_data`, courtDataList, { responseType: 'blob' });
  }
  subscribeToCase(caseNumberId: string , tag:string,): Observable<any> {
    const requestBody = {
      caseNumberId: caseNumberId,
      tag:tag
    };

    return this.http.post<any>(`${this.url}/api/v0/OpenCourtUser/create_users_subscription`, requestBody);
  }
  getUsersCases(skip: number = 0, limit: number = 1000): Observable<any> {
 
    return this.http.get<any>(`${this.url}/api/v0/OpenCourtUser/get_users_subscriptions?skip=${skip}&limit=${limit}`);
  }
  
  unsubscribeFromCase(id: number): Observable<any> {
    const patchEndpoint = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser/remove_users_subscription/${id}`;
    return this.http.patch(patchEndpoint, {});
  }
  addCourtData(data: any) {
    this.courtData.push(data);
  }
  getAllCourtData() {
    return this.courtData;
  }
  getsCourtData(): CalendarEvent[] {
    return this.courtData.map((data) => this.convertToCalendarEvent(data));
  }

  private convertToCalendarEvent(data: any): CalendarEvent {
    const meetingDateTime: Date = new Date(data.meetingDateTime); // Получаем дату и время заседания из данных
    const title: string = `Нове засідання: ${data.caseNumber}`; // Формируем заголовок события
  
    return {
      start: meetingDateTime, // Устанавливаем дату и время заседания
      title: title, // Устанавливаем заголовок события
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      meta: data, // Можете добавить дополнительные данные из объекта data
    };
  }
  subscribeToCaseWithTag(tag: string,id: number): Observable<any> {
    const requestBody = {
      tag: tag
    };
    return this.http.post(`${this.url}/api/v0/OpenCourtUser/update_cases_tag${id}`, requestBody);
  }
  updateCaseTag(caseId: number, tag: string): Observable<any> {
    const patchEndpoint = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser/update_subscriptions_tag/${caseId}`;
    const requestBody = { tag: tag };
    return this.http.patch(patchEndpoint, requestBody);
  }
  deleteTag(caseId: number): Observable<any> {
    const patchEndpoint = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser/remove_subscriptions_tag/${caseId}`;
    return this.http.patch(patchEndpoint, {}); // Передаємо порожній об'єкт як тіло запиту
  }
  getUsersEventHistory(subscriptionId: number, startDate: string, endDate: string): Observable<any> {
    const requestBody = {
      subscription_id: subscriptionId,
      type_ids: [],
      start_date: null,
      end_date: null
    };



    return this.http.post<any>(`${this.url}/api/v0/OpenCourtUser/get_users_event_history`, requestBody);
  }
  
  updateCourtEvent(eventId: number, newDate: Date,title: string): Observable<any> {
    const endpoint = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser/update_users_event/${eventId}`;
    const body = {
      typeDescriptionId: 15, 
      eventDate: newDate.toISOString(), 
      text: title
    };
    return this.http.patch<any>(endpoint, body);
  }
  createMeeting(meetingData: any) {
    return this.http.post(`${this.url}/api/v0/OpenCourtUser/create_users_event`, meetingData);
  }
  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.url}/api/v0/OpenCourtUser/create_users_event`, eventData);
  }
  getSubscriptionTypeDescriptions(): Observable<any> {
    return this.http.get(`${this.url}/api/v0/OpenCourtUser/get_users_option`);
  }
  deleteUserEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.url}/api/v0/OpenCourtUser/delete_users_event/${eventId}`);
  }
  getCourtEvents(skip: number = 0, limit: number = 1000): Observable<any> {
    return this.http.get<any>(`${this.url}/api/v0/OpenCourtUser/get_users_calendar_event?skip=${skip}&limit=${limit}`);
 
  }
  getNotifications(): any[] {
    return this.notifications;
  }

  setNotifications(notifications: any[]): void {
    this.notifications = notifications;
  }
  addComment(commentPayload: { comment: string, subscriptionId: number }): Observable<any> {
    return this.http.post<any>(`${this.url}/api/v0/OpenCourtUser/create_subscription_comment`, commentPayload);
  }
  updateComment(commentId: number, updatedComment: string): Observable<any> {
    const url = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourtUser/update_subscription_comment/${commentId}`;
    const body = { comment: updatedComment };
    return this.http.patch(url, body);
  }
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.url}/api/v0/OpenCourtUser/delete_subscription_comment/${commentId}`;
    return this.http.delete(url);
  }
  uploadFile(file: File, subscriptionId: number, instanceId: number, judgmentFormId: number, filename?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (filename) {
      formData.append('filename', filename);
    }
  
    const params = new HttpParams()
      .set('subscriptionId', subscriptionId.toString())
      .set('instanceId', instanceId.toString())
      .set('judgmentFormId', judgmentFormId.toString());
  
    return this.http.post(`${this.url}/api/v0/OpenCourtUser/upload_file`, formData, { params });
  }
 
  downloadFile(fileId: number): Observable<any> {
    return this.http.get(`${this.url}/api/v0/OpenCourtUser/download_file/${fileId}`, { responseType: 'blob' });
  }
  deleteFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.url}/api/v0/OpenCourtUser/delete_file/${fileId}`);
  }
  createExecutiveLetterTemplate(requestBody: any): Observable<Blob> {
    const url = `${this.url}/api/v0/OpenCourtUser/generate_issuance_executive_letter`;
    return this.http.post(url, requestBody, { responseType: 'blob' });
}
createCopieDecisionLetterTemplate(requestBody: any): Observable<any> {
  const url = `${this.url}/api/v0/OpenCourtUser/generate_copie_decision_letter`;
  return this.http.post(url, requestBody, { responseType: 'blob' });
}
createAdjournmentCaseLetterTemplate(requestBody: any): Observable<any> {
  const url = `${this.url}/api/v0/OpenCourtUser/generate_adjournment_case_letter`;
  return this.http.post(url, requestBody, { responseType: 'blob' });
}
createConsiderationWithoutPlaintiffTemplate(requestBody: any): Observable<any> {
  const url = `${this.url}/api/v0/OpenCourtUser/generate_consideration_without_plaintiff_letter`;
  return this.http.post(url, requestBody, { responseType: 'blob' });
}

}


    


