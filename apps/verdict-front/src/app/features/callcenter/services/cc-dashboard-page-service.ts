import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CcDashboardPageService {
  private readonly http = inject(HttpClient)

  private readonly url =
    (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.cc_api_url
  dataIsLoaded$: any

  postData(dateObject: any, isActual: boolean): Observable<any> {
    const params = new HttpParams().set('is_actual', isActual)

    return this.http.post<any>(this.url + '/call_center_metrics', dateObject, { params })
  }

  downloadExcel(data: any) {
    return this.http.post<Blob>(this.url + '/call_center_metrics_excel', data, { responseType: 'blob' as 'json' })
  }
}
