import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/verdict-front/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NksErrorsHttpService {
  private http = inject(HttpClient);

  private readonly url =
    (environment.BACKEND_URL || window.location.origin) +
    environment.API_BASE_URL +
    environment.nks_errors;

  getNonBannedContacts() {
    return this.http.get<any>(this.url + '/non_banned_contacts');
  }
}
