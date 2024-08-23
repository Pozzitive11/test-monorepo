import { DestroyRef, inject, Injectable, signal } from '@angular/core'
import { DcHttpService } from './dc-http.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { BehaviorSubject } from 'rxjs'
import { DcMilitaryDocsTableChanges } from '../models/dc-military-docs-table-changes'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class DcMilitaryDocsDataService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly destroyRef = inject(DestroyRef)

  readonly docTypeCol: string = 'Вид документу'
  readonly docTypeOtherCol: string = 'Інші документи'

  // для отображения инфы по выбранной строке в таблице
  INN: string = ''

  loading: boolean = false

  tableData: { [key: string]: any }[] = []
  header: string[] = []
  hiddenCols: string[] = ['RequestId']
  textFilters: { col: string; value: string }[] = []
  docTypeFilter: { military: string; other: string } = { military: '', other: '' }

  shownData = new BehaviorSubject<{ [key: string]: any }[]>([])
  shownDataLength: number = 0
  clientInfo = new BehaviorSubject<{ [key: string]: any }[]>([])

  page: number = 1
  rowsPerPage: number = 30

  militaryDocTree = signal<{ [key: string]: any }[]>([])
  militaryDocTypes = signal<{ id: number; name: string }[]>([])

  get maxPage(): number {
    return Math.floor(this.shownDataLength / this.rowsPerPage) + (this.shownDataLength % this.rowsPerPage ? 1 : 0)
  }

  getAllMilitaryDocs() {
    this.loading = true
    this.httpService.getAllMilitaryDocs().subscribe({
      next: (value) => {
        this.tableData = value
        this.textFilters = []
        if (this.tableData.length > 0)
          this.header = Object.keys(this.tableData[0]).filter((value) => !this.hiddenCols.includes(value))
        this.filterData()
      },
      error: (err) => {
        this.loading = false
        this.messageService.sendError(`${err.status}: ${err.error.detail}`)
      },
      complete: () => (this.loading = false)
    })
  }

  changeValue(row: number | null, rows: number[], col: string, value: string | null | { [key: string]: any }[]) {
    if (rows.length > 0) {
      if (typeof value === 'string' || value == null) {
        const dataUpdate: DcMilitaryDocsTableChanges = {
          ids: rows,
          INN: this.INN,
          col: col,
          value: value
        }
        this.httpService.changeDocInfo(dataUpdate).subscribe()
      }
      for (let id of rows) {
        const index = this.tableData.map((val) => val['RequestId']).indexOf(id)
        this.tableData[index][col] = value
      }
    } else {
      const index = this.tableData.map((val) => val['RequestId']).indexOf(row)
      this.tableData[index][col] = value
    }
  }

  filterData() {
    if (this.tableData.length > 0)
      this.header = Object.keys(this.tableData[0]).filter((value) => !this.hiddenCols.includes(value))

    let partOfData = UtilFunctions.filterData(this.tableData.slice(), this.textFilters)
    if (this.docTypeFilter.military) {
      partOfData = partOfData.filter((value) =>
        this.filterValue(value[this.docTypeCol], this.docTypeFilter.military, this.docTypeCol)
      )
    }
    if (this.docTypeFilter.other) {
      partOfData = partOfData.filter((value) =>
        this.filterValue(value[this.docTypeOtherCol], this.docTypeFilter.other, this.docTypeCol)
      )
    }
    this.shownDataLength = partOfData.length

    if (this.page > this.maxPage) this.page = this.maxPage
    if (this.page < 1) this.page = 1

    this.shownData.next(partOfData.slice(this.rowsPerPage * (this.page - 1), this.rowsPerPage * this.page))
    this.loading = false
  }

  filterValue(data: { [key: string]: any }[], value: string, col: string): boolean {
    // * - показать все пустые строки
    // ** - показать все не пустые строки
    if (value === '*') return !data.length
    else if (value === '**') return !!data.length

    return data
      .map((val) => val[col])
      .join(', ')
      .toLowerCase()
      .includes(value)
  }

  getOneINNInfo(INN: string) {
    this.INN = INN
    this.clientInfo.next(this.tableData.filter((value) => value['ІПН'] === INN))
  }

  clearINNInfo() {
    this.INN = ''
    this.clientInfo.next([])
  }

  removeClientDoc(docId: number) {
    for (let row of this.tableData) {
      if (row['ІПН'] === this.INN) {
        let colType = this.docTypeOtherCol
        if (row[this.docTypeCol].map((val: { [x: string]: number }) => val['DocumentId']).includes(docId)) {
          colType = this.docTypeCol
        }
        row[colType] = row[colType].filter((val: { [x: string]: number }) => val['DocumentId'] !== docId)
        this.clientInfo.next(this.tableData.filter((value) => value['ІПН'] === this.INN))
        return
      }
    }
  }

  makeExcel(inns: string[]) {
    this.httpService.makeExcelDocuments(inns).subscribe({
      next: (file) => UtilFunctions.downloadXlsx(file, 'Документи інфо', 'dmY'),
      error: async (error) => {
        this.messageService.sendError(
          'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
        )
        this.loading = false
      },
      complete: () => (this.loading = false)
    })
  }

  setMilitaryDocTree() {
    this.httpService
      .getMilitaryDocTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.militaryDocTree.set(value)
      })
  }

  setMilitaryDocTreeData() {
    this.httpService
      .getMilitaryDocTypes(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.militaryDocTypes.set(value))
  }
}
