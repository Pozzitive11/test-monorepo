import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  OnInit,
  Signal,
  signal
} from '@angular/core'
import { VsHttpService } from '../../services/vs-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { ModalService } from '../../../../shared/services/modal.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { catchError, finalize, interval, map, of, retry, switchMap, tap } from 'rxjs'
import { TCellEdit, TRow, TValue } from '../../../../shared/models/basic-types'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'
import { AsyncPipe, DecimalPipe, JsonPipe, NgForOf, NgIf } from '@angular/common'
import { FormatAnyValuePipe } from '../../../../shared/pipes/format-any-value.pipe'
import { TableResizeDirective } from '../../../../shared/directives/table-resize.directive'
import { IColumnTypeModel } from '../../models/table-inspector-info.model'
import { VsEditableCellComponent } from '../../components/vs-editable-cell/vs-editable-cell.component'
import { VsDataService } from '../../services/vs-data.service'
import { BasicFilterComponent } from '../../../../shared/components/basic-filter/basic-filter.component'
import { applyFilters, filtersInfo } from '../../../../shared/models/data-service-with-filters.model'
import { BasicFilterDataModel } from '../../../../shared/models/basic-filter-data.model'
import { FilterModel } from '../../../../shared/models/filter.model'
import { PaginationPipe } from '../../../../shared/pipes/pagination.pipe'
import { NgbAlert, NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import {
  MaxPageRowsFilterComponent
} from '../../../../shared/components/max-page-rows-filter/max-page-rows-filter.component'
import { ICanComponentDeactivate } from '../../../../core/guards/can-deactivate.guard'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { ShortTextPipe } from '../../../../shared/pipes/short-text.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { ColorPickerComponent } from '../../../../shared/components/color-picker/color-picker.component'
import { SheetUIModel } from '../../models/sheet-ui.model'
import { ErrorModel } from '../../../../shared/models/error.model'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { AccessLevelEnum } from '../../models/sheet-access-info.model'
import {
  DropdownSearchableComponent
} from '../../../../shared/components/dropdown-searchable/dropdown-searchable.component'
import { VsChangesService } from '../../services/vs-changes.service'
import dayjs from 'dayjs'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'

const createNew = 'Стоврити нову'

@Component({
  selector: 'app-vs-sheet-edit-page',
  standalone: true,
  imports: [
    LoadingBarComponent,
    NgIf,
    FormatAnyValuePipe,
    TableResizeDirective,
    VsEditableCellComponent,
    JsonPipe,
    PaginationPipe,
    AsyncPipe,
    NgbPagination,
    MaxPageRowsFilterComponent,
    SwitchCheckboxComponent,
    ShortTextPipe,
    ReactiveFormsModule,
    FormsModule,
    MatMenu,
    NgForOf,
    MatMenuItem,
    ColorPickerComponent,
    MatMenuTrigger,
    DropdownSearchableComponent,
    NgbAlert,
    DecimalPipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './vs-sheet-edit-page.component.html',
  styleUrls: ['./vs-sheet-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsSheetEditPageComponent implements OnInit, ICanComponentDeactivate {
  private readonly httpService = inject(VsHttpService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly messageService = inject(MessageHandlingService)
  protected readonly dataService = inject(VsDataService)
  private readonly modalService = inject(ModalService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly title = inject(Title)
  private readonly changesService = inject(VsChangesService)

  protected readonly String = String

  groupSheets = computed(() => {
    return Array.from(this.dataService.groupConfigs().values())
      .map((config) => ({
        name: config.sheet_name,
        uid: config.sheet_uid
      }))
  })

  loading = signal<boolean>(false)
  sheetUid = signal<string | null>(null)
  page = signal<number>(1)
  pageSize = signal<number>(30)

  userCanEdit = computed(
    () => this.dataService.userAccess()
      .filter((access) => (!access.uid || access.uid === this.sheetUid()) && access.level <= AccessLevelEnum.READ_WRITE)
      .length > 0
  )
  filteredData = computed(() => {
    const filteredData = this.dataService.filteredData()
    const changes = this.changes()
    const userLogin = this.changesService.userLogin()
    return filteredData.map((row) => {
      const changedCells = changes.filter((change) => change.id === row[this.dataService.getIdName(change.alias)])
      if (!changedCells.length) return row

      const newRow: TRow = { ...row }
      changedCells.forEach((changedRow) => {
        newRow[changedRow.alias] = changedRow.newValue
        newRow[`#${changedRow.alias}chagedByUser`] = changedRow.user_login
        newRow[`#${changedRow.alias}chagedByCurrentUser`] = changedRow.user_login === userLogin
      })
      return newRow
    })
  })
  dataLength = computed(() => this.filteredData().length)
  sheetName = computed(() => this.dataService.sheetConfig()?.sheet_name)
  columnTypes = computed(() => {
    const types = new Map<string, IColumnTypeModel>()
    const selectedColumns = this.dataService.sheetConfig()?.selected_columns || []
    const tables = new Map((this.dataService.sheetConfig()?.tables || []).map((table) => [table.table_name, table.inspector_info]))
    selectedColumns.forEach((col) => {
      if (!col.table_name) return
      const column = (tables.get(col.table_name) || []).find((c) => c.name === col.column_name)
      if (column) types.set(col.alias, column.type)
    })
    return types
  })

  hiddenColumns = signal<string[]>([])
  header = computed(() => this.dataService.header().filter((col) => !this.hiddenColumns().includes(col)))
  editableCols = computed(() =>
    (this.dataService.sheetConfig()?.selected_columns || [])
      .filter((col) => col.editable)
      .map((col) => col.alias)
  )
  highlightedRows = signal(new Set<string | number>())

  columnWidths = signal(new Map<string, number>())
  rowHeights = signal(new Map<string | number, number>())
  headerColors = signal(new Map<string, string>())
  usedColors = computed(() => {
    const defaultColors = new Set([
      '#C00000', '#FFC000', '#FFFF00', '#92D050',
      '#00B050', '#00B0F0', '#0070C0', '#002060',
      '#7030A0'
    ])
    Array.from(this.headerColors().values()).forEach((color) => defaultColors.add(color))
    return [...defaultColors]
  })
  fontSize = signal(11)
  scale = signal(100)
  uiChanged = signal(false)

  slowScale = computed(() => {
    const coef = 100
    return (coef + this.scale()) / (coef + 100)
  })
  scaledFontSize = computed(() => this.fontSize() * this.slowScale())
  scaledColumnWidths = computed(() => {
    return new Map(Array.from(this.columnWidths().entries()).map(([key, width]) => [key, width * this.scale() / 100]))
  })
  scaledRowHeights = computed(() => {
    return new Map(Array.from(this.rowHeights().entries()).map(([key, height]) => [key, height * this.scale() / 100]))
  })

  sheetUI = computed<SheetUIModel>(() => ({
    column_widths: Array.from(this.columnWidths().entries()),
    row_heights: Array.from(this.rowHeights().entries()),
    page_size: this.pageSize(),
    font_size: this.fontSize(),
    header_colors: Array.from(this.headerColors().entries()),
    scale: this.scale(),
    hidden_columns: this.hiddenColumns()
  }))
  saveForAllUsers = signal(true)

  changes: Signal<TCellEdit[]> = this.changesService.changes

  private readonly _interval = toSignal(interval(100).pipe(map(() => dayjs())), { initialValue: dayjs() })
  connectionError = this.changesService.connectionError
  tryToConnectIn = computed(() => {
    const { start, delay } = this.connectionError()
    if (!start) return 0
    const now = this._interval()
    const diff = now.diff(start)
    return diff < delay ? (delay - diff) / 1000 : 0
  })

  userChangesLength = computed(() => this.changesService.userChanges().length)

  // Pivot table stuff
  selectedPivotConfigName = signal<string>('')
  pivotConfigNames = signal<string[]>([])

  constructor() {
    const pageloadTime = dayjs()
    effect(() => this.title.setTitle(`Редагування таблиці "${this.sheetName()}"`))
    effect(() => {
      if (this._interval().diff(pageloadTime) < 1000 || this.loading()) return
      if (this.changesService.currentSocket()) return

      this.changesService.connectionError.set({ start: dayjs(), delay: 0 })
      this.changesService.changeSheet(this.sheetUid()!)
    }, { allowSignalWrites: true })
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.dataService.resetGroups()
      this.sheetUid.set(params.get('uid'))
      if (this.sheetUid()) this.loadSheet(this.sheetUid()!)
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if (this.changesService.userChanges().length) {
      this.changesService.saveChangesToLocalStorage()
      $event.preventDefault()
      // $event.returnValue = true
    }
  }

  loadSheet(uid: string, fromGroup: boolean = false) {
    this.loading.set(true)
    this.sheetUid.set(uid)

    this.dataService.loadSheet$(uid, fromGroup, () => {
      this._loadUI()
      this.loading.set(false)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: ({ config }) => {
          if (config.group_name && !this.dataService.groupConfigs().has(config.group_name)) {
            this._loadGroupConfigs(config.group_name)
          }
          this._loadUI()
          this._loadPivotConfigNames()
          this.changesService.changeSheet(uid)
        },
        error: async (error) => {
          await this.messageService.alertError(error)
          await this.router.navigate(['/verdict-sheets'])
        }
      })
  }

  private _loadGroupConfigs(groupName: string) {
    this.httpService.getSheetConfigGroup(groupName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (configs) => this.dataService.groupConfigs.set(
          new Map(configs.map((config) => [config.sheet_uid, config]))
        ),
        error: async (error) => await this.messageService.alertError(error)
      })
  }

  openFilter(col: string) {
    this.modalService.runModalComponent$<{ data: BasicFilterDataModel, values: TValue[] }, BasicFilterComponent, {
      filter?: FilterModel,
      sorting?: boolean
    }>(
      { data: filtersInfo(col, this.dataService), values: this.dataService.sheetData().map((row) => row[col]) },
      BasicFilterComponent,
      { centered: true, scrollable: true, size: '500px' }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newFilters) => applyFilters(col, newFilters, this.dataService))
  }

  isFilterApplied(key: string) {
    return this.dataService.sortingFilters.filter((value) => value.col === key).length +
      this.dataService.filters.filter((value) => value.col === key).length > 0
  }

  clearFilter(key: string) {
    this.dataService.filters = this.dataService.filters.filter((value) => value.col !== key)
    this.dataService.sortingFilters = this.dataService.sortingFilters.filter((value) => value.col !== key)

    setTimeout(() => this.dataService.filterData())
  }

  updateColumnWidth(key: string, width: number) {
    width = width * 100 / this.scale()
    if (this.columnWidths().get(key) === width) { return }
    this.columnWidths.update((widths) => {
      widths.set(key, width)
      return new Map(widths)
    })
    this.uiChanged.set(true)
  }

  updateRowHeight(row: TRow, height: number) {
    height = height * 100 / this.scale()
    let id = row[this.dataService.getIdName(this.editableCols()[0])]
    // Convert id to string or number in case it's not somehow
    id = (typeof id === 'string' || typeof id === 'number') ? id : !id ? '' : String(id)

    if (this.rowHeights().get(id) === height) { return }
    this.rowHeights.update((heights) => {
      heights.set(id, height)
      return new Map(heights)
    })
    this.uiChanged.set(true)
  }

  toggleColumn(col: string) {
    this.hiddenColumns.update((columns) => {
      return columns.includes(col) ? columns.filter((column) => column !== col) : columns.concat(col)
    })
    this.uiChanged.set(true)
  }

  includesTime(type: IColumnTypeModel) {
    return type.original_type.includes('TIME')
  }

  addChange(newValue: TValue, oldValue: TValue, alias: string, id: TValue) {
    if (oldValue === newValue || !oldValue && !newValue) return

    // Convert id to string or number in case it's not somehow
    id = (typeof id === 'string' || typeof id === 'number') ? id : !id ? '' : String(id)

    const columnConfig = this.dataService.sheetConfig()?.selected_columns.find((col) => col.alias === alias)
    if (!columnConfig) return this.messageService.sendError(`Не вдалося знайти конфігурацію стовпця для ${alias}`)
    const table = columnConfig.table_name!
    const column = columnConfig.column_name!
    const dictionary = this.getDictionary(alias)
    const db = columnConfig.db || this.dataService.sheetConfig()!.db

    const changes = this.changes()

    const index = changes.findIndex((change) => change.id === id && change.column === column && change.table === table)
    if (index === -1) {
      const dictionary_id = dictionary.find((d) => d.name === newValue)?.id
      this.changesService.postChange({
        id, column, table, newValue, oldValue,
        changedAt: dayjs().format(),
        dictionary_id, db, alias,
        sheet_uid: this.sheetUid()!,
        user_login: this.changesService.userLogin() || 'Blame it on admin'
      })
    } else if (changes[index].oldValue === newValue) {
      this.changesService.deleteChange(changes[index])
    } else {
      this.changesService.replaceChange({
        ...changes[index],
        newValue,
        changedAt: dayjs().format(),
        dictionary_id: dictionary.find((d) => d.name === newValue)?.id,
        sheet_uid: this.sheetUid()!,
        user_login: this.changesService.userLogin() || 'Blame it on admin'
      })
    }
  }

  resetChanges() {
    this.changesService.dropChanges()
  }

  saveChanges() {
    const userChanges = this.changesService.userChanges()
    if (!userChanges.length) return

    this.loading.set(true)
    this.httpService.saveChanges(userChanges, this.sheetUid()!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (resp) => {
          this.changesService.commitChanges()
          this.messageService.sendInfo(resp.description)
        },
        error: async (error) => await this.messageService.alertError(error)
      })
  }

  showChanges() {
    this.modalService.runConfirmModal$({
      title: 'Поточні зміни',
      confirmButtonType: 'primary',
      cancelButtonText: '',
      confirmButtonText: 'окі',
      showBody: true,
      confirmText: (
        `
          <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Стовпець з id</th>
              <th>id</th>
              <th>Користувач</th>
              <th>Стовпець</th>
              <th>Старе значення</th>
              <th>Нове значення</th>
              <th>Час зміни</th>
            </tr>
          </thead>
          <tbody>
        ` + this.changes()
          .filter((change) => change.user_login)
          .map((change) => `
            <tr>
              <td>${this.dataService.getIdName(change.alias)}</td>
              <td>${change.id}</td>
              <td>${change.user_login}</td>
              <td>${change.alias}</td>
              <td>${change.oldValue}</td>
              <td>${change.newValue}</td>
              <td>${dayjs(change.changedAt).format('DD.MM.YYYY HH:mm:ss')}</td>
            </tr>`
          ).join('')
      ) + `</tbody></table>`
    }, { centered: true, size: 'xl', fullscreen: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  canDeactivate() {
    const userChanges = this.changesService.userChanges()
    if (!userChanges.length) return of(true)

    this.changesService.saveChangesToLocalStorage()
    return this.modalService.runConfirmModal$({
      title: 'Незбережені зміни',
      confirmText: 'Ви впевнені, що хочете покинути сторінку без збереження змін?',
      confirmButtonText: 'Так, скинути зміни',
      cancelButtonText: 'Ні, залишитися',
      alternativeAction: 'Зберегти зміни і покинути сторінку',
      confirmButtonType: 'danger'
    }, { centered: true, size: '500px' })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((result) => {
          if (typeof result === 'string') {
            this.loading.set(true)
            return this.httpService.saveChanges(userChanges, this.sheetUid()!)
              .pipe(
                finalize(() => this.loading.set(false)),
                tap((result) => {
                  this.changesService.commitChanges()
                  this.messageService.sendInfo(result.description)
                }),
                map(() => true),
                catchError(async (err) => {
                  await this.messageService.alertError(err)
                  return false
                })
              )
          } else {
            return of(!!result)
          }
        })
      )

  }

  getDictionary(column: string) {
    const columnConfig = this.dataService.sheetConfig()?.selected_columns.find((col) => col.alias === column)
    if (!columnConfig || !columnConfig.dictionary_id) return []
    return this.dataService.dictionaryMap().get(columnConfig.dictionary_id) || []
  }

  updateColor(key: string, $event: string) {
    this.headerColors.update((colors) => {
      colors.set(key, $event)
      return new Map(colors)
    })
    this.uiChanged.set(true)
  }

  saveUIChanges() {
    this.loading.set(true)
    this.httpService.saveSheetUI(this.sheetUid()!, this.sheetUI(), this.saveForAllUsers())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          this.uiChanged.set(false)
          this.messageService.sendInfo('Зміни в інтерфейсі збережено')
        },
        error: async (error: ErrorModel) => await this.messageService.alertError(error)
      })
  }

  private _loadUI() {
    this.httpService.getSheetUI(this.sheetUid()!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        retry(3)
      )
      .subscribe({
        next: (ui) => {
          if (!ui) return

          this.columnWidths.set(new Map(ui.column_widths))
          this.rowHeights.set(new Map(ui.row_heights))
          this.pageSize.set(ui.page_size)
          this.fontSize.set(ui.font_size)
          this.scale.set(ui.scale)
          this.headerColors.set(new Map(ui.header_colors))
          this.hiddenColumns.set(ui.hidden_columns)
          this.highlightedRows.set(new Set())
          this.uiChanged.set(false)
        },
        error: async (error: ErrorModel) => await this.messageService.alertError(error)
      })
  }

  private _loadPivotConfigNames() {
    // Load pivot config names
    this.httpService.getPivotConfigNames(this.sheetUid()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (names) => {
          if (names.length) names = names.concat(createNew)
          this.pivotConfigNames.set(names)
        },
        error: (error) => this.messageService.sendError(error)
      })
  }

  getRowsFirstId(row: TRow) {
    let id = row[this.dataService.getIdName(this.editableCols()[0])]
    // Convert id to string or number in case it's not somehow
    id = (typeof id === 'string' || typeof id === 'number') ? id : !id ? '' : String(id)
    return id
  }

  downloadExcel() {
    this.loading.set(true)
    const filteredData = this.filteredData()
      .map((row) => {
        const header = this.header().filter((col) => !this.hiddenColumns().includes(col))
        return header.reduce((acc, col) => {
          acc[col] = row[col]
          return acc
        }, {} as TRow)
      })

    this.httpService.sheetToExcel(this.sheetUid()!, filteredData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res) => {
          try {
            UtilFunctions.saveFileFromHttp(res, true)
          } catch (e) {
            this.messageService.sendError(`Виникла помилка: ${e}`)
          }
        },
        error: async (error) => {
          this.messageService.sendError('Не вдалося завантажити файл: ' + JSON.parse(await error.error.text()).detail)
        }
      })
  }

  async makePivotTable(configName?: string) {
    if (configName === createNew) configName = undefined
    await this.router.navigate(['/verdict-sheets/pivot', this.sheetUid()], { queryParams: { config: configName } })
  }

  tryToConnect() {
    const sheetUid = this.sheetUid()
    if (!sheetUid) return
    this.connectionError.update(({ start }) => ({ start, delay: 0 }))
    this.changesService.changeSheet(sheetUid)
  }
}
