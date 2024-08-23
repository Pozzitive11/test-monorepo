import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { VsHttpService } from '../../services/vs-http.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { ISheetConfigInfoModel } from '../../models/sheet-info.model'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'
import { filter, finalize, switchMap, tap } from 'rxjs'
import { Router, RouterLink } from '@angular/router'
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe'
import { ModalService } from '../../../../shared/services/modal.service'
import { ShortTextPipe } from '../../../../shared/pipes/short-text.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { VsDataService } from '../../services/vs-data.service'
import { AccessLevelEnum } from '../../models/sheet-access-info.model'
import { VsAccessEditComponent } from '../../components/vs-access-edit/vs-access-edit.component'
import { AccordionComponent } from '../../../../shared/components/accordion/accordion.component'
import { NgTemplateOutlet } from '@angular/common'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { InputModalComponent } from '../../../../shared/components/input-modal/input-modal.component'
import { InputModalComponentModel } from '../../../../shared/components/input-modal/input-modal.component.model'
import { IAccessEditComponentModel } from '../../components/vs-access-edit/vs-access-edit.component.model'

@Component({
  selector: 'app-vs-sheets-page',
  standalone: true,
  imports: [
    LoadingBarComponent,
    RouterLink,
    FormatDatePipe,
    ShortTextPipe,
    NgbTooltip,
    AccordionComponent,
    NgTemplateOutlet,
    DefaultDropdownComponent
  ],
  templateUrl: './vs-sheets-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsSheetsPageComponent implements OnInit {
  private readonly httpService = inject(VsHttpService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly messageService = inject(MessageHandlingService)
  private readonly router = inject(Router)
  private readonly modalService = inject(ModalService)
  protected readonly dataService = inject(VsDataService)

  readonly isCollapsed = () => true
  sheets = signal<ISheetConfigInfoModel[]>([])
  groups = signal<string[]>([])
  groupsDropdown = computed(() => this.groups().concat(['Без групи']))
  groupObjects = computed(() => this.groups().map((group) => ({ name: group })))
  sheetsMap = computed(() => {
    const groupsMap = new Map<string | null, ISheetConfigInfoModel[]>(this.groups().map((group) => [group, []]))
    this.sheets().forEach((sheet) => {
      if (!groupsMap.has(sheet.groupName)) groupsMap.set(sheet.groupName, [])
      groupsMap.get(sheet.groupName)!.push(sheet)
    })
    return groupsMap
  })
  loading = signal<boolean>(true)
  selectedSheet = signal<ISheetConfigInfoModel | null>(null)
  showFullQuery = signal<boolean>(false)
  querySymbols = computed(() => this.showFullQuery() ? Infinity : 200)

  ngOnInit() {
    this.httpService.getGroups().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
      tap((groups) => this.groups.set(groups)),
      switchMap(() => this.httpService.getSheetList())
    )
      .subscribe({
        next: (sheets) => {
          sheets = sheets.filter((sheet) => {
            return this.dataService.userAccess()
              .filter((access) => (
                access.level <= AccessLevelEnum.READ_ONLY && (
                  (!access.uid && !access.groupName)
                  || access.uid === sheet.uid
                  || access.groupName === sheet.groupName
                )
              ))
              .length > 0
          })
          this.sheets.set(sheets)
        },
        error: (error) => this.messageService.alertError(error)
      })
  }

  editSheet(sheet: ISheetConfigInfoModel) {
    return this.router.navigate(['verdict-sheets', sheet.uid])
  }

  editConfig(selectedSheet: ISheetConfigInfoModel) {
    return this.router.navigate(['verdict-sheets', 'config', selectedSheet.uid])
  }

  addSheet() {
    return this.router.navigate(['verdict-sheets', 'config'])
  }

  deleteSheet(sheet: ISheetConfigInfoModel) {
    this.modalService.runConfirmModal$({
      showBody: false,
      title: 'Видалити таблицю?',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні'
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((confirmed) => !!confirmed),
      tap(() => this.loading.set(true)),
      switchMap(() => this.httpService.deleteSheet(sheet.uid).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      ))
    ).subscribe({
      next: (resp) => {
        this.messageService.sendInfo(resp.description)
        this.sheets.update((sheets) => sheets.filter((s) => s.uid !== sheet.uid))
        this.selectedSheet.set(null)
      },
      error: (error) => this.messageService.alertError(error)
    })
  }

  editAccessRights() {
    this.modalService.runModalComponent$<IAccessEditComponentModel, VsAccessEditComponent, void>(
      { uid: null, groupName: null },
      VsAccessEditComponent,
      { size: 'xl', centered: true }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  addNewGroup() {
    this.modalService.runModalComponent$<InputModalComponentModel, InputModalComponent, string>(
      { typeOfInput: 'text', value: '', placeholder: 'Назва групи', title: 'Додати нову групу' },
      InputModalComponent,
      { size: 'lg', centered: true }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((groupName) => {
        this.groups.update((groups) => [...new Set([...groups, groupName])])
        if (this.selectedSheet()) {
          this.updateSheetGroup(this.selectedSheet()!, groupName)
        }
      })
  }

  updateSheetGroup(sheet: ISheetConfigInfoModel, groupName: string | null) {
    this.loading.set(true)
    if (groupName === 'Без групи') groupName = null
    this.httpService.updateSheetGroup(sheet.uid, groupName)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.messageService.sendInfo(resp.description)
          this.sheets.update((sheets) => {
            const index = sheets.findIndex((s) => s.uid === sheet.uid)
            if (index === -1) return sheets
            const newSheet: ISheetConfigInfoModel = { ...sheet, groupName }
            return [...sheets.slice(0, index), newSheet, ...sheets.slice(index + 1)]
          })
        },
        error: (error) => this.messageService.alertError(error)
      })
  }

  deleteGroup(group: string) {
    this.modalService.runConfirmModal$({
      showBody: false,
      title: 'Розформувати групу?',
      confirmButtonText: 'Знищити',
      cancelButtonText: 'Ні'
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((confirmed) => !!confirmed),
      tap(() => this.loading.set(true)),
      switchMap(() => this.httpService.deleteGroup(group).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      ))
    ).subscribe({
      next: (resp) => {
        this.messageService.sendInfo(resp.description)
        this.groups.update((groups) => groups.filter((g) => g !== group))
        this.sheets.update((sheets) => sheets.map((sheet) => {
          if (sheet.groupName === group) return { ...sheet, groupName: null }
          return sheet
        }))
        this.selectedSheet.set(null)
      },
      error: (error) => this.messageService.alertError(error)
    })
  }
}
