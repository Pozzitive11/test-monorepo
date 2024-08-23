import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core'
import { VsHttpService } from '../../services/vs-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { VsDataService } from '../../services/vs-data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter, finalize, of, switchMap } from 'rxjs'
import { NgIf } from '@angular/common'
import { PivotTableComponent } from '../../../../shared/components/pivot-table/pivot-table.component'
import { PivotTableService } from '../../../../shared/components/pivot-table/pivot-table.service'
import {
  OffcanvasOptionsComponent
} from '../../../../shared/components/pivot-table/offcanvas-options/offcanvas-options.component'
import {
  DropdownSearchableComponent
} from '../../../../shared/components/dropdown-searchable/dropdown-searchable.component'
import { IPivotConfig } from '../../../../shared/components/pivot-table/models/pivot-table-config.model'
import { FormsModule } from '@angular/forms'
import { ModalService } from '../../../../shared/services/modal.service'

@Component({
  selector: 'app-vs-pivot-table-page',
  standalone: true,
  imports: [
    NgIf,
    PivotTableComponent,
    OffcanvasOptionsComponent,
    DropdownSearchableComponent,
    FormsModule
  ],
  templateUrl: './vs-pivot-table-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsPivotTablePageComponent implements OnInit {
  private readonly httpService = inject(VsHttpService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly messageService = inject(MessageHandlingService)
  protected readonly dataService = inject(VsDataService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly title = inject(Title)
  private readonly modalService = inject(ModalService)

  private readonly pivotTableService = inject(PivotTableService)

  sheetUid = signal<string | null>(null)

  sheetName = computed(() => this.dataService.sheetConfig()?.sheet_name)

  // PIVOT STUFF
  pivotConfigName = signal<string>('')
  selectedPivotConfigName = signal<string>('')
  pivotConfigNames = signal<string[]>([])
  private _configSnapshot: string = JSON.stringify(this.pivotTableService.pivotConfig)

  get configChanged() {
    return this._configSnapshot !== JSON.stringify(this.pivotTableService.pivotConfig)
  }

  constructor() {
    effect(() => this.title.setTitle(`Редагування зведеної таблиці "${this.sheetName()}"`))
  }

  ngOnInit() {
    this.pivotTableService.resetPivotTable()

    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (params) => {
        if (!params.get('uid')) {
          this.messageService.sendError('No sheet UID provided')
          await this.router.navigate(['/verdict-sheets'])
          return
        }

        this.sheetUid.set(params.get('uid'))
        if (this.sheetUid()) {
          // Load pivot config names
          this._loadPivotConfigNames()

          if (this.sheetUid() !== this.dataService.sheetUid()) {
            this.pivotTableService.loading.set(true)

            // Load sheet data
            this.dataService.loadSheet$(this.sheetUid()!, false)
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.pivotTableService.loading.set(false))
              )
              .subscribe({
                next: () => this._giveBirthToPivotTable(),
                error: (error) => this.messageService.sendError(error)
              })
          } else {
            this._giveBirthToPivotTable()
          }
        }
      })

    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['config']) {
          this.loadPivotConfig(params['config'])
        }
      })
  }

  private _giveBirthToPivotTable() {
    this.messageService.sendInfo('Дані завантажено')
    this.pivotTableService.loadData(of(this.dataService.sheetData()))
    setTimeout(() => this.pivotTableService.createPivotTable(), 0)
  }

  private _loadPreset(config: IPivotConfig) {
    this.pivotConfigName.set(config.name)
    this.pivotTableService.setPivotConfig(config)
    this._configSnapshot = JSON.stringify(this.pivotTableService.pivotConfig)

    if (this.pivotTableService.data().length) {
      setTimeout(() => this.pivotTableService.createPivotTable(), 0)
    }
  }

  loadPivotConfig(configName?: string) {
    if (!configName) return this.messageService.sendError('Не вказано назву конфігурації 🤦‍♂️️')
    if (!this.sheetUid()) return this.messageService.sendError('Як так вийшло, що ви не вибрали таблицю? 🤔️')

    this.selectedPivotConfigName.set(configName)

    this.pivotTableService.loading.set(true)
    this.httpService.loadPivotConfig(this.sheetUid()!, configName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => this._loadPreset(config),
        error: (error) => this.messageService.sendError(error)
      })
  }

  createPivotConfig(name: string) {
    if (!name) return this.messageService.sendError('Не вказано назву конфігурації 🤦‍♂️️')
    if (!this.sheetUid()) return this.messageService.sendError('Як так вийшло, що ви не вибрали таблицю? 🤔️')

    this.pivotTableService.loading.set(true)

    // Update name if only name is changed
    if (!this.pivotConfigNames().includes(this.pivotConfigName()) && !this.configChanged && this.selectedPivotConfigName()) {
      this.httpService.updatePivotConfigName(this.sheetUid()!, this.selectedPivotConfigName()!, name)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.pivotTableService.loading.set(false))
        )
        .subscribe({
          next: () => {
            this.messageService.sendInfo('Назву онвлено')
            this.selectedPivotConfigName.set(name)
            this._loadPivotConfigNames()
          },
          error: (error) => this.messageService.sendError(error)
        })
      return
    }

    // Create/update config
    const config: IPivotConfig = { ...this.pivotTableService.pivotConfig, name }
    this.httpService.createPivotConfig(this.sheetUid()!, config)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.pivotTableService.loading.set(false))
      )
      .subscribe({
        next: () => {
          this.messageService.sendInfo('Конфігурація збережена')
          this.selectedPivotConfigName.set(name)
          this._loadPivotConfigNames()
        },
        error: (error) => this.messageService.sendError(error)
      })
  }

  private _loadPivotConfigNames() {
    // Load pivot config names
    this.httpService.getPivotConfigNames(this.sheetUid()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (names) => this.pivotConfigNames.set(names),
        error: (error) => this.messageService.sendError(error)
      })
  }

  deletePivotConfig(name: string) {
    this.modalService.runConfirmModal$({
      title: 'Видалення конфігурації',
      confirmButtonType: 'danger',
      confirmButtonText: 'Видалити',
      cancelButtonText: 'Скасувати',
      showBody: false
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => !!confirmed),
        switchMap(() => {
          this.pivotTableService.loading.set(true)
          return this.httpService.deletePivotConfig(this.sheetUid()!, name)
        })
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.pivotTableService.loading.set(false))
      )
      .subscribe({
        next: (resp) => {
          this.messageService.sendError(resp.description)
          this._loadPivotConfigNames()
          this.pivotConfigName.set('')
          this.selectedPivotConfigName.set('')
        },
        error: (error) => this.messageService.sendError(error)
      })
  }
}
