import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { IFilterDataService } from '../../../shared/models/data-service-with-filters.model'
import { FilterModel } from '../../../shared/models/filter.model'
import { IQueryInfoModelFull } from '../models/query-info.model'
import { TTable } from '../../../shared/models/basic-types'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { VsHttpService } from './vs-http.service'
import { forkJoin, from, map, shareReplay, take, tap } from 'rxjs'
import { DictionaryModel } from '../../../shared/models/dictionary.model'
import { toSignal } from '@angular/core/rxjs-interop'
import { AccessLevelEnum } from '../models/sheet-access-info.model'

@Injectable({
  providedIn: 'root'
})
export class VsDataService implements IFilterDataService {
  private readonly httpService = inject(VsHttpService)

  private _userAccess$ = this.httpService.getUserAccess().pipe(take(1), shareReplay(1))
  userAccess = toSignal(this._userAccess$, { initialValue: [] })
  isAdmin = computed(() => this.userAccess().filter((access) => access.level === AccessLevelEnum.ADMIN).length > 0)
  isConfigurator = computed(() => this.userAccess().filter((access) => access.level === AccessLevelEnum.CONFIG).length > 0)

  private _filters = signal<{ col: string; filter: FilterModel }[]>([])
  groupFilters = signal<Map<string, { col: string; filter: FilterModel }[]>>(new Map())
  private _sortingFilters = signal<{ col: string; ascending: boolean }[]>([])
  groupSortingFilters = signal<Map<string, { col: string; ascending: boolean }[]>>(new Map())

  /** sheet_uid => sheet_config */
  groupConfigs = signal<Map<string, IQueryInfoModelFull>>(new Map())
  /** sheet_uid => sheet_data */
  groupData = signal<Map<string, TTable>>(new Map())
  private _sheetConfig = signal<IQueryInfoModelFull | null>(null)
  private _sheetData = signal<TTable>([])
  private _filteredData = signal<TTable>([])

  header = computed(() => this._sheetData().length ? Object.keys(this._sheetData()[0]) : [])

  sheetConfig = computed(() => this._sheetConfig())
  sheetData = computed(() => this._sheetData())
  filteredData = computed(() => this._filteredData())
  dictionaryIds = computed(() => {
    return [...new Set(
      this._sheetConfig()?.selected_columns
        .map((column) => column.dictionary_id)
        .filter((dictionaryId): dictionaryId is number => !!dictionaryId) || []
    )]
  })
  dictionaryMap = signal(new Map<number, DictionaryModel[]>())

  sheetUid = computed(() => this._sheetConfig()?.sheet_uid)

  get filters(): { col: string; filter: FilterModel }[] { return this._filters() }

  set filters(value: { col: string; filter: FilterModel }[]) { this._filters.set(value) }

  get sortingFilters(): { col: string; ascending: boolean }[] { return this._sortingFilters() }

  set sortingFilters(value: { col: string; ascending: boolean }[]) { this._sortingFilters.set(value) }

  constructor() {
    effect(() => {
      if (this.dictionaryIds().length) {
        forkJoin(
          this.dictionaryIds()
            .map((dictionaryId) => {
              return this.httpService.getDictionary(dictionaryId)
                .pipe(map((dictionary) => ({ dictionaryId, dictionary })))
            })
        )
          .subscribe((dictionaries) => this.dictionaryMap.set(new Map(dictionaries.map((d) => [d.dictionaryId, d.dictionary]))))
      }
    }, { allowSignalWrites: true })
  }

  checkDataType(col: string) {
    const columnConfig = this._sheetConfig()?.selected_columns.find((column) => column.alias === col)
    const table = this._sheetConfig()?.tables.find((table) => table.table_name === columnConfig?.table_name)
    const column = table?.inspector_info.find((column) => column.name === columnConfig?.column_name)

    if (!column) return 'undefined'
    if (column.type.ts_type === 'Date' || column.type.ts_type === 'unknown') return 'string'

    return column.type.ts_type
  }

  filterData(): void {
    let data = this._sheetData().slice()

    data = UtilFunctions.filterDataExtended(data, this.filters)
    UtilFunctions.sortData(data, this.sortingFilters)

    this._filteredData.set(data)
  }

  setSheetConfig(sheetConfig: IQueryInfoModelFull): void {
    this._sheetConfig.set(sheetConfig)
  }

  setSheetData(sheetData: TTable, callback?: () => void): void {
    this._sheetData.set(sheetData)
    this.filterData()
    callback?.()
  }

  getIdName(alias: string) {
    const columnConfig = this.sheetConfig()?.selected_columns.find((col) => col.alias === alias)
    if (!columnConfig) {
      return 'id'
    }

    return columnConfig.related_key || 'id'
  }

  resetGroups() {
    this.groupData.set(new Map())
    this.groupConfigs.set(new Map())
    this.groupFilters.set(new Map())
    this.groupSortingFilters.set(new Map())
  }

  updateGroupFilters(uid: string) {
    const currentUid = this.sheetConfig()?.sheet_uid

    if (currentUid) {
      this.groupFilters.update((filtersMap) => {
        filtersMap.set(currentUid, this._filters())
        return new Map(filtersMap)
      })
      this.groupSortingFilters.update((filtersMap) => {
        filtersMap.set(currentUid, this._sortingFilters())
        return new Map(filtersMap)
      })
    }

    this._filters.set(this.groupFilters().get(uid) || [])
    this._sortingFilters.set(this.groupSortingFilters().get(uid) || [])
  }

  changeSheet(uid: string, callback?: () => void) {
    this.updateGroupFilters(uid)
    this.setSheetConfig(this.groupConfigs().get(uid)!)
    setTimeout(() => {
      this.setSheetData(this.groupData().get(uid)!, callback)
    }, 0)
  }

  loadSheet$(uid: string, fromGroup: boolean, callback?: () => void) {
    if (fromGroup && this.groupData().has(uid) && this.groupConfigs().has(uid)) {
      this.changeSheet(uid, callback)
      return from([{ config: this.groupConfigs().get(uid)! }])
    }

    return forkJoin({
      data: this.httpService.getSheetData(uid),
      config: this.httpService.getSheetConfig(uid)
    }).pipe(
      tap(({ data, config }) => {
        if (config.group_name) {
          this.groupData.update((groupData) => {
            groupData.set(config.sheet_uid, data)
            return new Map(groupData)
          })
          this.groupFilters.update((groupFilters) => {
            groupFilters.set(config.sheet_uid, [])
            return new Map(groupFilters)
          })
          this.groupSortingFilters.update((groupSortingFilters) => {
            groupSortingFilters.set(config.sheet_uid, [])
            return new Map(groupSortingFilters)
          })
        }
        this.updateGroupFilters(uid)
        this.setSheetData(data)
        this.setSheetConfig(config)
      }),
      map(({ config }) => ({ config }))
    )
  }
}
