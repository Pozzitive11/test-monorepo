import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AsepProcessingRequestModel } from '../models/asep-processing-request.model';
import { BufferInfoModel } from '../models/buffer-info.model';
import { FileChecksModel } from '../models/file-checks.model';
import { ServerBasicResponse } from '../../../data-models/server-data.model';

@Injectable({
  providedIn: 'root',
})
export class AbHttpService {
  private http = inject(HttpClient);

  url = environment.asep_api_url;

  login(username: string) {
    return this.http.get<{ info: string }>(this.url + '/login/' + username);
  }

  uploadFile(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/upload_files',
      formData
    );
  }

  getFiles(session_id: string) {
    return this.http.get<any>(this.url + '/uploaded_files/' + session_id);
  }

  startProcessing(object: AsepProcessingRequestModel) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/start_processing_asvp',
      object
    );
  }

  getBufferInfo(update: boolean) {
    const params = new HttpParams().set('update', update);
    return this.http.get<BufferInfoModel>(this.url + '/buffer_info', {
      params,
    });
  }

  getBufferFile() {
    return this.http.get<Blob>(this.url + '/buffer', {
      responseType: 'blob' as 'json',
    });
  }

  getFileChecks() {
    return this.http.get<FileChecksModel[]>(`${this.url}/file_checks`);
  }

  sendBufferRepairFile(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/repair_buffer',
      formData
    );
  }
}
