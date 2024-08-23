import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'apps/verdict-front/src/environments/environment';
import { webSocket } from 'rxjs/webSocket';
import { AuthService } from '../../core/services/auth.service';
import { ServerBasicResponse } from '../../data-models/server-data.model';
import { MessageHandlingService } from '../../shared/services/message-handling.service';
import { UtilFunctions } from '../../shared/utils/util.functions';

@Injectable({
  providedIn: 'root',
})
export class ElectronicCourtHttpService {
  url = environment.electronic_court;

  ws = environment.electronic_court_socket;

  uploadFiles: any;

  uploadFilesReestr: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageHandlingService
  ) {}

  Address_check(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/send_claims_test',
      formData
    );
  }

  Reestr_check(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/create_register',
      formData
    );
  }

  wsInfoAboutAdress(user: string) {
    return webSocket<string>(this.ws + '/' + user);
  }

  downloadFile_electronic_court(
    username: string | undefined,
    filename: string
  ) {
    if (!username) {
      return;
    }

    this.http
      .get<Blob>(this.url + '/send_claims' + '/' + username, {
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (file) => {
          const modifiedFilename = filename + ' ID Заяв';
          UtilFunctions.downloadXlsx(file, modifiedFilename, null);
        },
        error: async (error) => {
          this.messageService.sendError(
            JSON.parse(await error.error.text()).detail
          );
        },
      });
  }

  downloadFile_electronic_court_error(
    username: string | undefined,
    filename: string
  ) {
    if (!username) return;

    this.http
      .get<Blob>(this.url + '/send_claims' + '/' + username + '/error', {
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (file) => {
          const modifiedFilename = filename + ' Проблемні Заяви';
          UtilFunctions.downloadXlsx(file, modifiedFilename, null);
        },
        error: async (error) => {
          this.messageService.sendError(
            JSON.parse(await error.error.text()).detail
          );
        },
      });
  }
}
