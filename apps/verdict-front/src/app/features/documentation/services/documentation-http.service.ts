import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { Document } from '../models/documentation.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentationHttpService {
  private readonly http = inject(HttpClient)
  private readonly url =
    (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.discounts_api_url

  getDocList() {
    return this.http.get<Document[]>(this.url + '/doc_dictionary')
  }

  downloadDocFetch(fileId: number) {
    const params = new HttpParams().set('file_id', fileId)
    return this.http.post<Blob>(this.url + `/doc_file`, null, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    })
  }
}
