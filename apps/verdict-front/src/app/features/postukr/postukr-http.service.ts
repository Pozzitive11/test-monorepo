import { HttpClient, HttpParams } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from 'apps/verdict-front/src/environments/environment';
import {
  ServerBasicResponse,
  SenderResponse,
} from '../../data-models/server-data.model';
import { MessageHandlingService } from '../../shared/services/message-handling.service';
import { UtilFunctions } from '../../shared/utils/util.functions';

@Injectable({
  providedIn: 'root',
})
export class PostUkrHttpService {
  private http = inject(HttpClient);
  private messageService = inject(MessageHandlingService);

  url = environment.ukrpost;

  ws = environment.postukr_socket;

  uploadFiles: any;

  uploadFilesReestr: any;

  addressCheck(formData: FormData) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/check_address',
      formData
    );
  }
  getSenders(): Observable<SenderResponse> {
    return this.http.get<SenderResponse>(`${this.url}/get_senders`);
  }

  registerCheck(formData: FormData, params: HttpParams) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/create_register',
      formData,
      { params }
    );
  }

  wsInfoAboutAddress(user: string) {
    return webSocket<string>(this.ws + '/address_socket' + '/' + user);
  }

  wsInfoAboutReestr(user: string) {
    return webSocket<string>(this.ws + '/register_socket' + '/' + user);
  }

  downloadFileUkrpost(username: string | undefined, filename: string) {
    if (!username) return;

    this.http
      .get<Blob>(this.url + '/download' + '/' + username, {
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (file) => UtilFunctions.downloadXlsx(file, filename, null),
        error: async (error) => {
          this.messageService.sendError(
            JSON.parse(await error.error.text()).detail
          );
        },
      });
  }

  uploadShipment(data: object) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/create_shipment',
      data
    );
  }

  deletedShipment(data: object) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/delete_shipment',
      data
    );
  }

  editShipment(data: object) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/edit_shipment',
      data
    );
  }

  deleteReestr(data: object) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/delete_shipment_group',
      data
    );
  }

  createRegisterButton(data: object) {
    return this.http.post<ServerBasicResponse>(
      this.url + '/create_register_empty',
      data
    );
  }

  tableFullRegister(data: object) {
    return this.http.post(this.url + '/register_review', data, {
      responseType: 'arraybuffer',
    });
  }
}
