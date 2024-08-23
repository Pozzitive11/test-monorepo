import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  signal
} from '@angular/core'
import { IColumnEditComponentModel } from './vs-column-edit.component.model'
import { IColumnInfoModel, ITableInfoModel } from '../../models/query-info.model'
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { ToSignals } from '../../../../shared/utils/typing.utils'
import { InputInGroupComponent } from '../../../../shared/components/input-in-group/input-in-group.component'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { ITableInspectorInfoModel } from '../../models/table-inspector-info.model'
import { TDbServers } from '../../models/vserdict-sheet.types'
import { ISheetDictionaryModel } from '../../models/sheet-dictionary.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { ModalService } from '../../../../shared/services/modal.service'
import { VsDictionaryEditComponent } from '../vs-dictionary-edit/vs-dictionary-edit.component'
import { IDictionaryEditModel } from '../vs-dictionary-edit/vs-dictionary-edit.component.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { VsHttpService } from '../../services/vs-http.service'
import { finalize } from 'rxjs'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'

@Component({
  selector: 'app-vs-column-edit',
  standalone: true,
  imports: [
    InputInGroupComponent,
    DefaultDropdownComponent,
    SwitchCheckboxComponent,
    NgbTooltip,
    LoadingBarComponent
  ],
  templateUrl: './vs-column-edit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsColumnEditComponent implements ToSignals<IColumnEditComponentModel>, OnInit {
  private readonly httpService = inject(VsHttpService)
  private readonly activeModal = inject(NgbActiveModal)
  private readonly modalService = inject(ModalService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly destroyRef = inject(DestroyRef)

  readonly dbList: TDbServers[] = ['56', '64', '68']

  column = model.required<IColumnInfoModel>()
  tables = input.required<ITableInfoModel[]>()
  dictionaries = signal<ISheetDictionaryModel[]>([])

  loading = signal(false)
  tableNames = computed(() => this.tables().map((t) => t.table_name))
  selectedTable = computed(() => this.tables().find((t) => t.table_name === this.column().table_name))
  tableColumns = computed<string[]>(() => this.selectedTable()?.inspector_info.map((c) => c.name) || [])
  columnInfo = computed<ITableInspectorInfoModel | undefined>(
    () => this.selectedTable()?.inspector_info.find((c) => c.name === this.column().column_name)
  )
  isDictionary = signal(false)
  dictionaryNames = computed(() => this.dictionaries()?.map((d) => `${d.id}. ${d.name}`) || [])
  selectedDictionary = computed(() => {
    const dictionary = this.dictionaries()?.find((d) => d.id === this.column().dictionary_id)
    return dictionary ? `${dictionary.id}. ${dictionary.name}` : ''
  })

  canBeSaved = computed(() => {
    const { editable, related_key, dictionary_id, column_name } = this.column()
    if (dictionary_id) {
      const columnInfo = this.selectedTable()?.inspector_info.find((c) => c.name.toLowerCase() === column_name?.toLowerCase())
      if (columnInfo && columnInfo.type.ts_type !== 'number') return false
    }

    return editable ? !!(related_key && this.tableColumns().includes(related_key)) : true
  })

  ngOnInit() { this.getDictionaryList() }

  save() { this.activeModal.close(this.column()) }

  cancel() { this.activeModal.dismiss() }

  private getDictionaryList() {
    this.loading.set(true)
    this.httpService.getDictionaryList()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe((dictionaries) => this.dictionaries.set(dictionaries))
  }

  private saveDictionary(dictionary: ISheetDictionaryModel) {
    this.loading.set(true)
    this.httpService.saveDictionary(dictionary)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
          next: (id) => {
            this.column.update((c) => ({ ...c, dictionary_id: id }))
            this.messageService.sendInfo('Словник успішно збережено')
            this.getDictionaryList()
          },
          error: (error) => this.messageService.alertError(error)
        }
      )
  }

  updateAlias(alias?: string) {
    this.column.update((c) => ({ ...c, alias: alias || '' }))
  }

  updateTableName(tableName?: string | null) {
    const table = this.tables().find((t) => t.table_name === tableName)
    const related_key = table?.inspector_info.find((c) => c.unique)?.name || null
    this.column.update((c) => ({
      ...c,
      table_name: tableName || null,
      column_name: null,
      related_key,
      editable: c.editable && !!c.dictionary_id
    }))
  }

  updateColumnName(columnName?: string | null) {
    this.column.update((c) => ({ ...c, column_name: columnName || null }))
  }

  updateRelatedKey(columnName?: string | null) {
    this.column.update((c) => ({ ...c, related_key: columnName || null }))
  }

  updateEditability(editable: boolean) {
    const related_key = this.selectedTable()?.inspector_info.find((c) => c.unique)?.name || null
    this.column.update((c) => ({
      ...c,
      editable,
      for_insert: false,
      related_key: editable ? related_key : null
    }))
  }

  updateForInsert(for_insert: boolean) {
    this.column.update((c) => ({ ...c, for_insert, editable: false, related_key: null }))
  }

  updateDb(db?: TDbServers | '') {
    this.column.update((c) => ({ ...c, db: db || null }))
  }

  updateDictionary(dictionaryName?: string) {
    const dictionary_id = parseInt(dictionaryName?.split('.')[0] || '0', 10) || null
    if (dictionary_id && !this.column().dictionary_id) {
      this.modalService.runConfirmModal$({
        title: 'Обережно!',
        confirmText: 'Перевірте чи таблиця та відповідний стовпець відповідають необхідній таблиці для зміни, а не таблиці словника!',
        confirmButtonText: 'ОК (залишити таблицю)',
        cancelButtonText: 'Змінити таблицю'
      }, { centered: true }, true)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            if (result) return this.column.update((c) => ({ ...c, dictionary_id }))
            this.column.update((c) => ({ ...c, table_name: null, column_name: null, related_key: null, dictionary_id }))
          },
          error: () => {
            this.column.update((c) => ({ ...c, table_name: null, column_name: null, related_key: null, dictionary_id }))
          }
        })
    } else {
      this.column.update((c) => ({ ...c, dictionary_id }))
    }
  }

  addEditDictionary(dictionaryName: string | null) {
    let dictionary = this.dictionaries().find((d) => `${d.id}. ${d.name}` === dictionaryName) || {
      id: null,
      name: '',
      db: this.column().db || '56',
      query: ''
    }

    this.modalService.runModalComponent$<IDictionaryEditModel, VsDictionaryEditComponent, ISheetDictionaryModel>(
      { dictionary },
      VsDictionaryEditComponent,
      { size: 'lg' }
    )
      .subscribe((editedDictionary) => this.saveDictionary(editedDictionary))
  }
}
