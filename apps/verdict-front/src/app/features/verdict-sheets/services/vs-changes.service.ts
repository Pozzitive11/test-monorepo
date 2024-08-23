import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { VsHttpService } from './vs-http.service'
import { WebSocketSubject } from 'rxjs/webSocket'
import { TCellEdit, theSameCell, theSameCellEdit } from '../../../shared/models/basic-types'
import { ISheetChangeUpdateModel } from '../models/sheet-change-update.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { BehaviorSubject, filter, finalize, map, of, retry, switchMap, tap, timer } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import dayjs, { Dayjs } from 'dayjs'
import { AuthService } from '../../../core/services/auth.service'
import { VsDataService } from './vs-data.service'

@Injectable({
  providedIn: 'root'
})
export class VsChangesService {
  private readonly httpService = inject(VsHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly authService = inject(AuthService)
  private readonly dataService = inject(VsDataService)

  private readonly _currentSheetUid = new BehaviorSubject<string | null>(null)
  readonly socketConnection = toSignal(
    this._currentSheetUid.pipe(
      switchMap((sheetUid) => this._changeSheet$(sheetUid)),
      filter(({ data }) => !!data),
      map(({ data, sheetUid }) => {
        if (typeof data === 'string') return { data: JSON.parse(data) as ISheetChangeUpdateModel, sheetUid }
        return { data, sheetUid }
      })
    ), { initialValue: null }
  )

  readonly userLogin = toSignal(this.authService.user.pipe(
    map((user) => user?.username)
  ), { initialValue: undefined })
  private readonly _changes = signal<TCellEdit[]>([])
  readonly userChanges = computed(() => this._changes().filter((change) => change.user_login === this.userLogin()))

  private readonly sockets = signal(new Map<string, WebSocketSubject<string | ISheetChangeUpdateModel>>())
  readonly currentSocket = computed(() => this.sockets().get(this.currentSheetUid() || '') || null)

  readonly currentSheetUid = signal<string | null>(null)
  readonly connectionError = signal<{ start: Dayjs | null, delay: number }>({ start: null, delay: 0 })
  readonly changes = computed(() => this._changes())

  constructor() {
    effect(() => {
      const clearDuplicates = (changes: TCellEdit[]) => {
        const uniqueChanges: TCellEdit[] = []
        changes.forEach((change) => {
          if (!uniqueChanges.find((i) => theSameCellEdit(i, change))) {
            uniqueChanges.push(change)
          }
        })
        return uniqueChanges
      }

      this._changes.update((changes) => {
        const socketConnection = this.socketConnection()
        const socketChange = socketConnection?.data
        if (!socketConnection || !socketChange) return clearDuplicates(changes)

        const sheetUid = socketConnection.sheetUid

        switch (socketChange.action) {
          // add is used when other user adds a new change
          case 'add':
            return clearDuplicates([...changes, socketChange.change])

          // delete is used when other user drops its changes
          case 'delete':
            return clearDuplicates(changes.filter((c) => !socketChange.items.some((sc) => theSameCell(sc, c))))

          // replace is used to synchronize changes with the server (only for the first time user connects to the websocket)
          case 'replace':
            const localChanges = localStorage.getItem(`vs-changes-${sheetUid}`)
            if (localChanges) {
              const changes: TCellEdit[] = JSON.parse(localChanges)
              return clearDuplicates(this._compareChanges(changes, socketChange.items, sheetUid))
            }
            return clearDuplicates(socketChange.items)

          // commit_saved is used when other user saves its changes to the DB
          case 'commit_saved':
            // ! must be run used with setTimeout to avoid dependency from sheetData signal
            setTimeout(() => this._updateSheetData(socketChange.items), 0)
            return clearDuplicates(changes.filter((c) => !socketChange.items.some((sc) => theSameCell(sc, c))))

          default:
            return clearDuplicates(changes)
        }
      })
    }, { allowSignalWrites: true })
  }

  changeSheet(sheetUid: string) {
    this._currentSheetUid.next(sheetUid)
  }

  private _changeSheet$(sheetUid: string | null) {
    if (!sheetUid) return of({ data: null, sheetUid })

    this.saveChangesToLocalStorage()

    return this.authService.user.pipe(
      switchMap((user) => {
        if (!user) return of({ data: null, sheetUid })
        return this._connectToSocket$(sheetUid, user.token)
      })
    )
  }

  /**
   * Replace change with the new one (in case of changing the same cell)
   * @param change
   */
  replaceChange(change: TCellEdit) {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const connectionError = this.connectionError().start
    const socket = this.sockets().get(sheetUid)
    if (socket) {
      socket.next({ action: 'delete', items: [change], uid: sheetUid })
      socket.next({ action: 'add', change, uid: sheetUid })
      if (connectionError) {
        this._changes.update((changes) => {
          const newChanges = changes.filter((c) => !theSameCell(c, change))
          return [...newChanges, change]
        })
        localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(this.userChanges()))
      }
    }
  }

  /**
   * Send change to the server. It will be broadcasted to all users connected to the sheet (including the current user)
   * @param change
   */
  postChange(change: TCellEdit) {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const connectionError = this.connectionError().start
    const socket = this.sockets().get(sheetUid)
    if (socket) {
      socket.next({ action: 'add', change, uid: sheetUid })
      if (connectionError) {
        this._changes.update((changes) => [...changes, change])
        localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(this.userChanges()))
      }
    }
  }

  /**
   * Drop the change. It will be broadcasted to all users connected to the sheet (including the current user)
   * @param change
   */
  deleteChange(change: TCellEdit) {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const connectionError = this.connectionError().start
    const socket = this.sockets().get(sheetUid)
    if (socket) {
      socket.next({ action: 'delete', items: [change], uid: sheetUid })
      if (connectionError) {
        this._changes.update((changes) => changes.filter((c) => !theSameCell(c, change)))
        localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(this.userChanges()))
      }
    }
  }

  /**
   * Drop all changes. It will be broadcasted to all users connected to the sheet (including the current user)
   */
  dropChanges() {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const connectionError = this.connectionError().start
    const socket = this.sockets().get(sheetUid)
    if (socket) {
      socket.next({ action: 'drop', uid: sheetUid })
      if (connectionError) {
        const userLogin = this.userLogin()
        this._changes.update((changes) => changes.filter((c) => c.user_login !== userLogin))
        localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(this.userChanges()))
      }
    }

    localStorage.removeItem(`vs-changes-${sheetUid}`)
  }

  /**
   * Apply changes. It will be broadcasted to all users connected to the sheet (including the current user).
   */
  commitChanges() {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const socket = this.sockets().get(sheetUid)
    if (socket) {
      socket.next({ action: 'commit', uid: sheetUid })
    }

    localStorage.removeItem(`vs-changes-${sheetUid}`)
  }

  /**
   * Save changes to the local storage
   */
  saveChangesToLocalStorage() {
    const sheetUid = this.currentSheetUid()
    if (!sheetUid) return

    const changes = this.userChanges()
    if (!changes.length) return

    localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(changes))
  }

  private _connectToSocket$(sheetUid: string, token: string) {
    this.currentSheetUid.set(sheetUid)
    if (!this.sockets().has(sheetUid)) {
      this.sockets().set(sheetUid, this.httpService.connectToSheetChanges(sheetUid, token))
    }

    return this.sockets().get(sheetUid)!
      .pipe(
        retry({
          delay: (_error, retryCount) => {
            const interval = 2000
            const delay = Math.pow(2, retryCount - 1) * interval
            this.connectionError.set({ start: dayjs(), delay: delay })
            if (retryCount === 1) {
              this.messageService.sendError(`Помилка підключення до сервера...`)
              const changes = this.userChanges()
              if (changes.length) {
                localStorage.setItem(`vs-changes-${sheetUid}`, JSON.stringify(changes))
              }
            }
            return timer(delay)
          },
          resetOnSuccess: true
        }),
        tap(() => {
          if (this.connectionError().start) {
            this.messageService.sendInfo('Підключення до сервера відновлено')
            this.connectionError.set({ start: null, delay: 0 })
          }
        }),
        map((data) => ({ data, sheetUid })),
        finalize(() => {
          this.sockets.update((sockets) => {
            const newSockets = new Map(sockets)
            const currentSocket = newSockets.get(sheetUid)
            if (currentSocket) {
              currentSocket.complete()
              newSockets.delete(sheetUid)
            }
            return newSockets
          })
        })
      )
  }

  private _compareChanges(localChanges: TCellEdit[], serverChanges: TCellEdit[], sheetUid: string | null) {
    const uniqueLocalChanges = localChanges.filter((change) => !serverChanges.find((i) => theSameCellEdit(i, change)))

    if (uniqueLocalChanges.length && sheetUid) {
      const socket = this.sockets().get(sheetUid)
      if (socket) {
        uniqueLocalChanges.forEach((change) => socket.next({ action: 'add', change, uid: sheetUid }))
      }
    }

    return (
      uniqueLocalChanges
        .concat(serverChanges)
        .sort((a, b) => dayjs(a.changedAt).valueOf() - dayjs(b.changedAt).valueOf())
    )
  }

  private _updateSheetData(userChanges: TCellEdit[]) {
    const sheetData = this.dataService.sheetData()
    this.dataService.setSheetData(
      sheetData.map((row) => {
        const changedRows = userChanges.filter((change) => change.id === row[this.dataService.getIdName(change.alias)])
        if (!changedRows.length) return row

        const newRow = { ...row }
        changedRows.forEach((changedRow) => (newRow[changedRow.alias] = changedRow.newValue))
        return newRow
      })
    )
  }
}
