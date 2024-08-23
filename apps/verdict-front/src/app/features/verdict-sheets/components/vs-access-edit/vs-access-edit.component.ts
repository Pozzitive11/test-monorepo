import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, model, OnInit, signal } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { VsHttpService } from '../../services/vs-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { IAccessEditComponentModel } from './vs-access-edit.component.model'
import { ToSignals } from '../../../../shared/utils/typing.utils'
import {
  AccessLevelEnum,
  accessLevels,
  ISheetAccessInfoModel,
  TAccessLevel
} from '../../models/sheet-access-info.model'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'
import { finalize, forkJoin, take } from 'rxjs'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import {
  DropdownSearchableComponent
} from '../../../../shared/components/dropdown-searchable/dropdown-searchable.component'
import { ISheetConfigInfoModel } from '../../models/sheet-info.model'
import { VsDataService } from '../../services/vs-data.service'
import { AuthService } from '../../../../core/services/auth.service'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'

@Component({
  selector: 'app-vs-access-edit',
  standalone: true,
  imports: [
    LoadingBarComponent,
    DefaultDropdownComponent,
    DropdownSearchableComponent,
    SwitchCheckboxComponent
  ],
  templateUrl: './vs-access-edit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsAccessEditComponent implements ToSignals<IAccessEditComponentModel>, OnInit {
  private readonly activeModal = inject(NgbActiveModal)
  private readonly httpService = inject(VsHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly authService = inject(AuthService)
  protected readonly dataService = inject(VsDataService)

  readonly superAccessLevels = (
    accessLevels
      .filter(({ value }) => value <= AccessLevelEnum.CONFIG)
      .map(({ label }) => label)
  )
  readonly regularAccessLevels = (
    accessLevels
      .filter(({ value }) => value > AccessLevelEnum.CONFIG)
      .map(({ label }) => label)
  )

  readonly uid = model.required<string | null>()
  readonly groupName = model<string | null>(null)
  readonly user = toSignal(this.authService.user)

  readonly loading = signal(false)

  superAccesses = signal<ISheetAccessInfoModel[]>([])
  regularAccesses = signal<ISheetAccessInfoModel[]>([])
  sheetsRegularAccesses = computed(() => {
    if (this.editGroups()) return this.regularAccesses().filter(({ groupName }) => groupName && groupName === this.groupName())
    return this.regularAccesses().filter(({ sheetUid }) => sheetUid === this.uid())
  })
  users = signal<{ id: number, login: string, fullName: string | null }[]>([])
  userList = computed(() => {
    return this.users().map((user) => this.userLabel({
      userId: user.id,
      userLogin: user.login,
      userFullName: user.fullName
    }))
  })
  editGroups = signal(false)
  sheets = signal<ISheetConfigInfoModel[]>([])
  sheetsList = computed(() => ['Адміністрування'].concat(
    this.editGroups() ?
      this.groups() :
      this.sheets()
        .filter(({ groupName }) => !this.groupName() || this.groupName() === groupName)
        .map(({ name }) => name)
  ))
  groups = signal<string[]>([])

  sheetLabel = computed(() => {
    if (this.editGroups()) return this.groupName() || 'Адміністрування'
    const sheet = this.sheets().find(({ uid: sheetUid }) => sheetUid === this.uid())
    return sheet ? `${sheet.name}` : 'Адміністрування'
  })

  newAccesses = signal<ISheetAccessInfoModel[]>([])
  deletedAccesses = signal<ISheetAccessInfoModel[]>([])

  ngOnInit() {
    this.loading.set(true)
    forkJoin({
      superAccesses: this.httpService.getSheetsAccess(true),
      regularAccesses: this.httpService.getSheetsAccess(false),
      users: this.httpService.getUsers(),
      sheets: this.httpService.getSheetList()
    })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ superAccesses, regularAccesses, users, sheets }) => {
          this.superAccesses.set(superAccesses)
          this.regularAccesses.set(regularAccesses)
          this.users.set(users)
          this.sheets.set(sheets)
          this.groups.set(sheets.map(({ groupName }) => groupName).filter((group): group is string => !!group))
        },
        error: async (error) => {
          await this.messageService.alertError(error)
          this.dismiss()
        }
      })
  }

  getAccessName(accessLevel: TAccessLevel) {
    return accessLevels.find(({ value }) => value === accessLevel)?.label || 'кєк'
  }

  updateAccess(access: ISheetAccessInfoModel, isSuper: boolean, accessName?: string) {
    if (!accessName || accessName === 'кєк') {
      return this.messageService.sendError('Щось пішло не так 😶‍🌫️')
    }

    this.newAccesses.update((accesses) => {
      if (this.editGroups()) {
        accesses = accesses.filter((a) => a.groupName !== access.groupName || a.userId !== access.userId)
      } else {
        accesses = accesses.filter((a) => a.userId !== access.userId || a.sheetUid !== access.sheetUid)
      }
      accesses.push({ ...access, accessLevel: accessLevels.find(({ label }) => label === accessName)!.value })
      return accesses
    })
    this.filterAccesses(access, isSuper)
  }

  addAccess() {
    this.newAccesses.update((accesses) => ([
      ...accesses,
      {
        sheetUid: this.editGroups() ? null : this.uid(),
        groupName: this.editGroups() ? this.groupName() : null,
        accessLevel: (this.uid() || this.groupName()) ? AccessLevelEnum.READ_ONLY : AccessLevelEnum.ADMIN,
        userId: 0,
        userLogin: null,
        userFullName: null
      }
    ]))
  }

  updateUserInAccess(access: ISheetAccessInfoModel, userLabel?: string) {
    if (!userLabel) {
      return this.messageService.sendError('Щось пішло не так 😶‍🌫️')
    }

    const userId = +userLabel.split('.')[0]
    const user = this.users().find(({ id }) => id === userId)
    this.newAccesses.update((accesses) => {
      if (this.editGroups())
        accesses = accesses.filter((a) => a.userId !== access.userId || a.groupName !== access.groupName)
      else
        accesses = accesses.filter((a) => a.userId !== access.userId || a.sheetUid !== access.sheetUid)
      accesses.push({ ...access, userId, userLogin: user?.login || null, userFullName: user?.fullName || null })
      return accesses
    })
  }

  userLabel({ userId, userLogin, userFullName }: {
    userId: number,
    userLogin: string | null,
    userFullName: string | null
  }) {
    if (!userId) return ''
    if (!userFullName) {
      return userLogin ? `${userId}. ${userLogin}` : `${userId}`
    }
    if (!userLogin) return `${userId}. ${userFullName}`

    return `${userId}. ${userLogin} (${userFullName})`
  }

  changeSheet(label?: string) {
    if (this.editGroups()) {
      this.groupName.set(label === 'Адміністрування' ? null : label || null)
    } else {
      const uid = this.sheets().find(({ name }) => name === label)?.uid || null
      this.uid.set(uid)
    }
  }

  dismiss() { this.activeModal.dismiss() }

  save() {
    this.loading.set(true)
    forkJoin([
      this.httpService.saveSheetAccess(this.newAccesses().filter((access) => !!access.userId)),
      ...this.deletedAccesses().map((access) => this.httpService.deleteSheetAccess(access.sheetUid, access.groupName, access.userId))
    ])
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.messageService.sendInfo('Доступи успішно збережено')
          this.activeModal.close()
        },
        error: async (error) => await this.messageService.alertError(error)
      })
  }

  removeAccess(access: ISheetAccessInfoModel, isSuper: boolean) {
    this.deletedAccesses.update((accesses) => [...accesses, access])
    this.filterAccesses(access, isSuper)
  }

  private filterAccesses(access: ISheetAccessInfoModel, isSuper: boolean) {
    if (isSuper) {
      this.superAccesses.update((accesses) => {
        if (this.editGroups())
          return accesses.filter((a) => a.userId !== access.userId || a.groupName !== access.groupName)
        else
          return accesses.filter((a) => a.userId !== access.userId || a.sheetUid !== access.sheetUid)
      })
    } else {
      this.regularAccesses.update((accesses) => {
        if (this.editGroups())
          return accesses.filter((a) => a.userId !== access.userId || a.groupName !== access.groupName)
        else
          return accesses.filter((a) => a.userId !== access.userId || a.sheetUid !== access.sheetUid)
      })
    }
  }
}
