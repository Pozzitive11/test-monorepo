import { HttpClient, HttpParams } from '@angular/common/http'

import { inject, Injectable } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import { ServerBasicResponse } from '../../../data-models/server-data.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { environment } from '../../../../environments/environment'
import { IFile } from '../models/file.model'


@Injectable({
  providedIn: 'root'
})
export class LwHttpService {
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private messageService = inject(MessageHandlingService)

  url = environment.edrsr
  url2 = environment.judiciary

  session_id = String(this.authService.loadedUser?.username)

  userFiles: { file: File }[] = []

  uploadedUserFiles: IFile[] = []

  starProcessing_EDRSR(object: object) {
    return this.http.post<any>(
      this.url + '/search',
      object
    )
  }

  uploadFile(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url2 + '/upload_files',
      formData
    )
  }

  getCash(filename: string, session_id: string) {
    const params = new HttpParams()
      .set('table', filename)
      .set('username', session_id)
    return this.http.get<{ [key: string]: any }[]>(
      this.url + '/search/result/', { params }
    )
  }

  getInfo(filename: string, session_id: string) {
    const params = new HttpParams()
      .set('username', session_id)
      .set('filename', filename)

    return this.http.get<any>(
      this.url2 + '/check_finish', { params }
    )
  }

  downloadFile(filename: string, username: string) {
    if (!username)
      return


    const params = new HttpParams()
      .set('table', filename)
      .set('username', username)

    this.http.get<Blob>(
      this.url + '/search/download',
      { params, responseType: 'blob' as 'json' }
    ).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, filename, null),
      error: async error => {
        this.messageService.sendError(JSON.parse(await error.error.text()).detail)
      }
    })
  }

  downloadFile_bot(filename: string, username: string | undefined) {
    if (!username)
      return

    const params = new HttpParams()
      .set('filename', filename)
      .set('username', username)
    this.http.get<Blob>(
      this.url2 + '/download',
      { params, responseType: 'blob' as 'json' }
    ).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, filename, null),
      error: async error => {
        this.messageService.sendError(JSON.parse(await error.error.text()).detail)

      }
    })
  }

  getFiles(session_id: string) {
    const params = new HttpParams()
      .set('username', session_id)
    return this.http.get<IFile[]>(
      this.url2 + '/check_available_files', { params }
    )
  }

  deleteFile(session_id: string, filename: string) {
    return this.http.delete<ServerBasicResponse>(
      this.url2 + '/file/' + session_id + '/' + filename
    )
  }


}
