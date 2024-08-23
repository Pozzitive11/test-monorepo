import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ITableInspectorInfoModel } from '../models/table-inspector-info.model'
import { IQueryInfoModel, IQueryInfoModelFull } from '../models/query-info.model'
import { TDbServers } from '../models/vserdict-sheet.types'
import { ISheetConfigInfoModel } from '../models/sheet-info.model'
import { ServerBasicResponse } from '../../../data-models/server-data.model'
import { TCellEdit, TTable } from '../../../shared/models/basic-types'
import { DictionaryModel } from '../../../shared/models/dictionary.model'
import { ISheetDictionaryModel } from '../models/sheet-dictionary.model'
import { SheetUIModel } from '../models/sheet-ui.model'
import { ISheetAccessInfoModel, TAccessLevel } from '../models/sheet-access-info.model'
import { IPivotConfig } from '../../../shared/components/pivot-table/models/pivot-table-config.model'
import { webSocket } from 'rxjs/webSocket'
import { ISheetChangeUpdateModel } from '../models/sheet-change-update.model'

@Injectable({
  providedIn: 'root'
})
export class VsHttpService {
  private readonly http = inject(HttpClient)

  private readonly url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.verdict_sheets

  getTableInfo(table_name: string, db: TDbServers) {
    return this.http.get<ITableInspectorInfoModel[]>(this.url + '/table-info', { params: { table_name, db } })
  }

  saveQuery(query: string, db: TDbServers) {
    return this.http.post<IQueryInfoModel>(this.url + '/query', query, { params: { db } })
  }

  saveSheetConfig(name: string, query: string, config: IQueryInfoModel, uid?: string, group_name?: string) {
    return this.http.post<string>(this.url + '/sheet-config', { query, name, config, uid, group_name })
  }

  getSheetConfig(uid: string) {
    return this.http.get<IQueryInfoModelFull>(this.url + '/sheet-config', { params: { uid } })
  }

  getSheetConfigGroup(group_name: string) {
    return this.http.get<IQueryInfoModelFull[]>(this.url + '/sheet-config-group', { params: { group_name } })
  }

  getSheetList() {
    return this.http.get<ISheetConfigInfoModel[]>(this.url + '/sheet-list')
  }

  deleteSheet(uid: string) {
    return this.http.delete<ServerBasicResponse>(this.url + '/sheet-config', { params: { uid } })
  }

  getSheetData(uid: string) {
    return this.http.get<TTable>(this.url + '/sheet-data', { params: { uid } })
  }

  saveChanges(changes: TCellEdit[], uid: string) {
    return this.http.post<ServerBasicResponse>(this.url + '/sheet-update', changes, { params: { uid } })
  }

  saveDictionary(dictionary: ISheetDictionaryModel) {
    return this.http.post<number>(this.url + '/sheet-dictionary', {
      ...dictionary,
      dictionary_id: dictionary.id,
      id: undefined
    })
  }

  getDictionary(dictionary_id: number) {
    return this.http.get<DictionaryModel[]>(this.url + '/sheet-dictionary', { params: { dictionary_id } })
  }

  getDictionaryList() {
    return this.http.get<ISheetDictionaryModel[]>(this.url + '/sheet-dictionary-list')
  }

  getSheetUI(uid: string) {
    return this.http.get<SheetUIModel | null>(this.url + '/sheet-ui', { params: { uid } })
  }

  saveSheetUI(uid: string, ui: SheetUIModel, save_for_all_users: boolean = false) {
    return this.http.post<ServerBasicResponse>(this.url + '/sheet-ui', ui, { params: { uid, save_for_all_users } })
  }

  sheetToExcel(uid: string, data: TTable) {
    return this.http.post<Blob>(this.url + '/sheet-to-excel', data, {
      params: { uid },
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  getSheetsAccess(super_access: boolean) {
    return this.http.get<ISheetAccessInfoModel[]>(this.url + '/sheets-access', { params: { super_access } })
  }

  saveSheetAccess(sheetAccesses: ISheetAccessInfoModel[]) {
    return this.http.post<ServerBasicResponse>(this.url + '/sheets-access', sheetAccesses)
  }

  deleteSheetAccess(uid: string | null, group_name: string | null, user_id: number) {
    return this.http.delete<ServerBasicResponse>(this.url + '/sheets-access', {
      params: {
        uid: uid || '',
        group_name: group_name || '',
        user_id
      }
    })
  }

  getUsers() {
    return this.http.get<{ id: number, login: string, fullName: string | null }[]>(this.url + '/users')
  }

  getUserAccess() {
    return this.http.get<{
      uid: string | null,
      groupName: string | null,
      level: TAccessLevel
    }[]>(this.url + '/user-access')
  }

  getGroups() {
    return this.http.get<string[]>(this.url + '/groups')
  }

  updateSheetGroup(uid: string, group_name: string | null) {
    return this.http.patch<ServerBasicResponse>(this.url + '/sheet-group', { uid, group_name })
  }

  deleteGroup(name: string) {
    return this.http.delete<ServerBasicResponse>(this.url + '/group', { params: { name } })
  }

  loadPivotConfig(uid: string, name: string) {
    return this.http.get<IPivotConfig>(this.url + '/pivot-config', { params: { uid, name } })
  }

  createPivotConfig(uid: string, config: IPivotConfig) {
    return this.http.post<ServerBasicResponse>(this.url + '/pivot-config', { uid, config })
  }

  deletePivotConfig(uid: string, name: string) {
    return this.http.delete<ServerBasicResponse>(this.url + '/pivot-config', { params: { uid, name } })
  }

  getPivotConfigNames(uid: string) {
    return this.http.get<string[]>(this.url + '/pivot-config-names', { params: { uid } })
  }

  updatePivotConfigName(uid: string, old_name: string, new_name: string) {
    return this.http.patch<ServerBasicResponse>(this.url + '/pivot-config-name', { uid, old_name, new_name })
  }

  connectToSheetChanges(uid: string, token?: string) {
    return webSocket<string | ISheetChangeUpdateModel>(
      this.url.replace(/https?:\/\//, 'ws://') + `/sheet-changes/${uid}`
      + (token ? `?token=${token}` : '')
    )
  }
}
