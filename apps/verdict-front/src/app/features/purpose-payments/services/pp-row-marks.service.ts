import { inject, Injectable } from '@angular/core'
import { PpTableDataService } from './pp-table-data.service'

@Injectable({
  providedIn: 'root'
})
export class PpRowMarksService {
  private readonly tableData = inject(PpTableDataService)

  idList: string[] = []

  addId(id: string) {
    if (id === 'all') {
      this.idList = this.tableData.getAllIds()
      this.idList.push('all')
    } else
      this.idList.push(id)
    this.tableData.dataIsLoading$.next(false)
  }

  removeId(id: string) {
    if (id === 'all')
      this.idList = []
    else
      this.idList = this.idList.filter((val) => (val !== id && val !== 'all'))
    this.tableData.dataIsLoading$.next(false)
  }

  listNoAll(exclude: string[]): string[] {
    return this.idList.filter((val) => !(val === 'all' || exclude.includes(val)))
  }
}
