import { inject, Injectable } from '@angular/core'
import { FileInfoModel } from '../../../features/asep-bot/models/file-info.model'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { AuthService } from '../../../core/services/auth.service'
import { MessageHandlingService } from '../../services/message-handling.service'
import { UtilFunctions } from '../../utils/util.functions'
import { webSocket } from 'rxjs/webSocket'
import { WebSocketCommandModel } from '../../models/web-socket-command.model'
import { BehaviorSubject } from 'rxjs'
import { ServerBasicResponse } from '../../../data-models/server-data.model'

@Injectable({
  providedIn: 'root'
})
export class AsepUserFilesInfoService {
  readonly commands = {
    stop: 'stop',
    getInfo: 'get_info'
  }
  readonly filetypes = {
    EP_NUM_PLUS_ID: 'За номером ВП та ідентифікатором',
    EP_NUM: 'За номером ВП',
    INN_ONLY: 'За РНОКПП',
    FIO_INN: 'За ПІБ',
    EDRPOU: 'За ЄДРПОУ',
    EP_DOWNLOAD_FILES: 'Завантаження файлів з АСВП',
    UNKNOWN: 'Невідомо',
    NOT_FOUND: 'Файл не знайдено'
  }
  url = environment.asep_api_url
  ws = environment.asep_socket
  loading: boolean = false
  asepUserFiles: FileInfoModel[] = []
  filesInProgress = new BehaviorSubject<string[]>([])
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private messageService = inject(MessageHandlingService)

  get username() {
    return this.authService.loadedUser?.username
  }

  wsConnect() {
    if (!this.username)
      return

    return webSocket<string | WebSocketCommandModel>(
      this.ws + '/file_process_socket/' + this.username
    )
  }

  update() {
    if (!this.username)
      return

    this.loading = true
    this.http.get<FileInfoModel[]>(
      this.url + '/files_info/' + this.username
    ).subscribe({
      next: info => {
        this.asepUserFiles = info
        this.filesInProgress.next(
          this.asepUserFiles
            .filter(fileInfo => fileInfo.Status === 'В обробці')
            .map(fileInfo => fileInfo.Filename)
        )
      },
      error: error => {
        this.loading = false
        this.messageService.sendError(error.error.detail)
      },
      complete: () => this.loading = false
    })
  }

  getFileInfo(filename: string) {
    if (!this.username)
      return

    return this.http.get<FileInfoModel>(
      this.url + '/file_info/' + this.username + '/' + filename
    )
  }

  downloadFile(filename: string) {
    if (!this.username)
      return

    this.loading = true
    this.http.get<Blob>(
      this.url + '/user_file/' + this.username + '/' + filename,
      { responseType: 'blob' as 'json' }
    ).subscribe({
      next: (file) => UtilFunctions.downloadXlsx(file, filename, null),
      error: async (error) => {
        this.loading = false
        this.messageService.sendError(JSON.parse(await error.error.text()).detail)
      },
      complete: () => this.update()
    })
  }

  deleteFile(filename: string) {
    if (!this.username)
      return

    this.loading = true
    return this.http.delete<ServerBasicResponse>(
      this.url + '/file/' + this.username + '/' + filename
    ).subscribe({
      next: res => this.messageService.sendInfo(res.description),
      error: error => {
        this.loading = false
        this.messageService.sendError(error.error.detail)
      },
      complete: () => this.update()
    })
  }

  stopProcessingFile(filename: string) {
    if (!this.username)
      return

    this.loading = true
    this.http.get<ServerBasicResponse>(
      this.url + '/stop_processing/' + this.username + '/' + filename
    ).subscribe({
      next: res => this.messageService.sendInfo(res.description),
      error: error => {
        this.loading = false
        this.messageService.sendError(error.error.detail)
      },
      complete: () => this.loading = false
    })
  }

  updateFile(info: FileInfoModel) {
    this.asepUserFiles.forEach(file => {
      if (file.Filename === info.Filename) {
        file.Percent = info.Percent
        file.SecondsLeft = info.SecondsLeft
        file.Status = info.Status
      }
    })
  }
}
