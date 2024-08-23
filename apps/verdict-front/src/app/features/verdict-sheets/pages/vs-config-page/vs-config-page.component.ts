import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild
} from '@angular/core'
import { VsHttpService } from '../../services/vs-http.service'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'
import { NgbTooltip, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common'
import { filter, finalize, of, switchMap, tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { TDbServers } from '../../models/vserdict-sheet.types'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { VsTableInfoComponent } from '../../components/vs-table-info/vs-table-info.component'
import { IColumnInfoModel, IQueryInfoModel, ITableInfoModel } from '../../models/query-info.model'
import { AccordionComponent } from '../../../../shared/components/accordion/accordion.component'
import { ShortTextPipe } from '../../../../shared/pipes/short-text.pipe'
import { VsSelectedColumnsComponent } from '../../components/vs-selected-columns/vs-selected-columns.component'
import { ModalService } from '../../../../shared/services/modal.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { VsDataService } from '../../services/vs-data.service'
import { VsAccessEditComponent } from '../../components/vs-access-edit/vs-access-edit.component'
import { IAccessEditComponentModel } from '../../components/vs-access-edit/vs-access-edit.component.model'

const noGroup = 'Без групи'

@Component({
  selector: 'app-vs-config-page',
  standalone: true,
  imports: [
    LoadingBarComponent,
    NgbTypeahead,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    DefaultDropdownComponent,
    VsTableInfoComponent,
    AccordionComponent,
    ShortTextPipe,
    NgbTooltip,
    VsSelectedColumnsComponent
  ],
  templateUrl: './vs-config-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsConfigPageComponent implements OnInit {
  private readonly httpService = inject(VsHttpService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly messageService = inject(MessageHandlingService)
  private readonly modalService = inject(ModalService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly title = inject(Title)
  protected readonly dataService = inject(VsDataService)

  readonly sqlInputView = viewChild<ElementRef<HTMLTextAreaElement>>('sqlQueryInput')
  readonly asITableInfoModel = (item: any): ITableInfoModel => item

  readonly dbList: TDbServers[] = ['56', '64', '68']

  loading = signal<boolean>(false)
  sqlQuery = signal<string>('')
  hideTextArea = signal<boolean>(false)
  tableName = signal<string>('')
  db = signal<TDbServers>('56')
  sheetName = signal<string>('')
  sheetUid = signal<string | null>(null)

  groups = signal<string[]>([])
  groupsDropdown = computed(() => this.groups().concat([noGroup]))
  groupName = signal<string | null>(null)

  readonly sheetConfig = signal<IQueryInfoModel | null>(null)
  readonly configIsValid = computed(() => {
    const config = this.sheetConfig()
    return !!config && !!config.tables.length
      && !!config.selected_columns.length
      && config.selected_columns.every((c) => !c.editable || c.related_key || c.for_insert)
      && !!this.sheetName()
  })

  constructor() {
    effect(() => {
      if (!this.hideTextArea()) this.sqlInputView()?.nativeElement.focus()
    })
    effect(() => this.title.setTitle(this.sheetName() ? `Конфігурація таблиці "${this.sheetName()}"` : 'Нова конфігурація таблиці'))
  }

  async ngOnInit() {
    if (!this.dataService.isAdmin() && !this.dataService.isConfigurator()) {
      this.messageService.sendError('У вас відсутній доступ до цієї сторінки')
      await this.router.navigate(['/verdict-sheets'])
    }
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const sheetUid = params.get('uid')
      if (sheetUid) this.loadSheetConfig(sheetUid)
    })

    this.httpService.getGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (groups) => this.groups.set(groups),
      error: (error) => this.messageService.alertError(error)
    })
  }

  loadSheetConfig(sheetUid: string) {
    this.sheetUid.set(sheetUid)
    this.loading.set(true)
    this.httpService.getSheetConfig(sheetUid)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.db.set(data.db)
          this.sqlQuery.set(data.sql_query)
          this.sheetName.set(data.sheet_name)
          this.groupName.set(data.group_name)
          this.hideTextArea.set(true)
          this.sheetConfig.set({
            db: data.db,
            tables: data.tables,
            selected_columns: data.selected_columns
          })
        },
        error: (error) => this.messageService.alertError(error)
      })
  }

  loadTableInfo() {
    this.loading.set(true)
    const db = this.db()
    this.httpService.getTableInfo(this.tableName(), db)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.sheetConfig.update((info): IQueryInfoModel => {
          if (!info) return {
            db,
            tables: [{
              table_name: this.tableName(),
              inspector_info: data
            }],
            selected_columns: []
          }

          return {
            ...info,
            tables: info.tables.concat([{
              table_name: this.tableName(),
              inspector_info: data
            }])
          }
        }),
        error: (error) => this.messageService.alertError(error)
      })
  }

  saveQuery() {
    let confirm$
    if (this.sheetConfig()) {
      confirm$ = this.modalService.runConfirmModal$({
        confirmText: 'Перезавантажити конфігурацію?',
        cancelButtonText: 'Змінити тільки запит',
        confirmButtonText: 'Так, перезавантажити'
      })
    } else {
      confirm$ = of(true)
    }
    this.hideTextArea.set(true)

    confirm$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((result) => !!result),
      tap(() => this.loading.set(true)),
      switchMap(() => this.httpService.saveQuery(this.sqlQuery(), this.db()).pipe(
        takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))
      ))
    )
      .subscribe({
        next: (data) => this.sheetConfig.set(data),
        error: (error) => this.messageService.alertError(error)
      })
  }

  saveSheetConfig() {
    if (!this.sheetConfig()) return this.messageService.sendError('Не вдалося зберегти конфігурацію: відсутні дані')

    this.loading.set(true)
    this.httpService.saveSheetConfig(
      this.sheetName(),
      this.sqlQuery(),
      this.sheetConfig()!,
      this.sheetUid() || undefined,
      this.groupName() === noGroup ? undefined : (this.groupName() || undefined)
    )
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (sheetUid) => {
          this.messageService.sendInfo(`Конфігурацію "${sheetUid}" збережено успішно`)
          await this.router.navigate(['/verdict-sheets', 'config', sheetUid])
        },
        error: (error) => this.messageService.alertError(error)
      })
  }

  selectColumn(columns: IColumnInfoModel[]) {
    this.sheetConfig.update((config) => {
      if (!config) return config

      return {
        ...config,
        selected_columns: config.selected_columns.concat(columns)
      }
    })
  }

  updateConfig(selected_columns: IColumnInfoModel[]) {
    this.sheetConfig.update((config) => config && { ...config, selected_columns })
  }

  editAccessRights() {
    if (!this.sheetUid()) {
      return this.messageService.sendError('Не вдалося відкрити доступ: конфігурація не створена')
    }
    this.modalService.runModalComponent$<IAccessEditComponentModel, VsAccessEditComponent, void>(
      { uid: this.sheetUid(), groupName: this.groupName() },
      VsAccessEditComponent,
      { size: 'xl', centered: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  goToSheet() {
    if (this.sheetUid()) return this.router.navigate(['/verdict-sheets', this.sheetUid()])
    return
  }
}
