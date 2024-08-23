import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DvsInfo, DvsResponds, PrivateAgentsInfo, PrivateAgentsResponds } from '../models/executive-proceedings.model';

@Injectable({
    providedIn: 'root'
  })
  export class ExecutiveProceedingsService {
    private url = 'http://dev.data-factory.ua/asvp-info';
  
    constructor(private http: HttpClient) {}
  
    getExucutiveData(vpOrderNums: string[], orgNameIds: number[], orgNameType: number,skip: number = 0, limit: number = 1000): Observable<any> {
      const apiUrl = `${this.url}/api/v0/AsvpInfo/get_asvp_info?skip=${skip}&limit=${limit}`;
      const requestBody = {
        VP_ORDERNUMs: vpOrderNums.length > 0 ? vpOrderNums : [],  // Передаем пустой массив, если нет значений
        VP_STATE_ids: [],
        CREDITOR_NAMEs: [],
        DEBTOR_NAMEs: [],
        ORG_NAME_ids: orgNameIds.length > 0 ? orgNameIds : [],  // Передаем пустой массив, если нет значений
        ORG_NAME_TYPE: orgNameType,  // Передаем выбранное значение
        Region_ids: [],
        start_date: "2020-07-22",
        end_date: "2024-07-22"
      };
    
      return this.http.post<any>(apiUrl, requestBody);
    }
  
    getDvsData(skip: number = 0, limit: number = 1000): Observable<DvsInfo[]> {
      return this.http.get<DvsResponds>(`${this.url}/api/v0/AsvpInfo/get_dvs?skip=${skip}&limit=${limit}`)
        .pipe(
          map(response => response.dvs_names)
        )
    }
    getPrivateAgentsData(skip: number = 0, limit: number = 1000): Observable<PrivateAgentsInfo[]> {
      return this.http.get<PrivateAgentsResponds>(`${this.url}/api/v0/AsvpInfo/get_private_agents?skip=${skip}&limit=${limit}`)
        .pipe(
          map(response => response.private_agents)
        )
    }
}
  