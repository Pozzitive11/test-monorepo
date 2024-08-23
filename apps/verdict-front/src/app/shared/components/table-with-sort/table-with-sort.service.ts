import { Injectable, signal } from '@angular/core'
import { UtilFunctions } from '../../utils/util.functions'

@Injectable({
  providedIn: 'root'
})
export class TableWithSortService {
  tableHeaders: string[] = []
  regularApplicationsLoader = false

  filteredTableData = signal<{ [key: string]: any }[]>([])

  textFilters = signal<{ col: string; value: string }[]>([])

  documentFilters: string[] = []

  checkedRows: number[] = []

  applyDocumentFilters(applications: { [key: string]: any }[]): { [key: string]: any }[] {
    if (this.documentFilters.length === 0) {
      return applications
    }

    return applications.filter((application) => {
      return this.documentFilters.every((filter) => application[filter] === true)
    })
  }
  getFilteredApplications(tableData: any) {
    this.filteredTableData.update(() => {
      let filteredApplications = [...tableData]
      filteredApplications = UtilFunctions.filterTableData(filteredApplications, this.textFilters())
      filteredApplications = this.applyDocumentFilters(filteredApplications)
      return filteredApplications
    })
  }

  sortApplications(column: string, direction: 'asc' | 'desc') {
    this.filteredTableData.update((applications) => {
      return applications.sort((a, b) => {
        if (a[column] < b[column]) {
          return direction === 'asc' ? -1 : 1
        } else if (a[column] > b[column]) {
          return direction === 'asc' ? 1 : -1
        } else {
          return 0
        }
      })
    })
  }
}
