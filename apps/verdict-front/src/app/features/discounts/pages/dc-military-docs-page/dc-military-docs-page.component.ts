import { Component, inject, OnInit } from '@angular/core'
import { DcMilitaryDocsDataService } from '../../services/dc-military-docs-data.service'
import { DcmClientInfoComponent } from '../../components/dc-military/dcm-client-info/dcm-client-info.component'
import { DcUploadClientDocsComponent } from '../../components/dc-upload-client-docs/dc-upload-client-docs.component'
import {
  MaxPageRowsFilterComponent
} from '../../../../shared/components/max-page-rows-filter/max-page-rows-filter.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dc-military-docs-page',
  templateUrl: './dc-military-docs-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    MaxPageRowsFilterComponent,
    DcUploadClientDocsComponent,
    DcmClientInfoComponent,
    NgFor,
    AsyncPipe
  ]
})
export class DcMilitaryDocsPageComponent implements OnInit {
  private readonly dataService = inject(DcMilitaryDocsDataService)

  checkedRows: string[] = []

  get docTypeCol(): string { return this.dataService.docTypeCol }

  get docTypeOtherCol(): string { return this.dataService.docTypeOtherCol }

  get loading() { return this.dataService.loading }

  get header() { return this.dataService.header }

  get data$() { return this.dataService.shownData }

  get dataLength() { return this.dataService.tableData.length }

  // PAGINATION STUFF
  get total_pages() { return this.dataService.maxPage }

  get page() { return this.dataService.page }

  get rowsPerPage() { return this.dataService.rowsPerPage }

  set rowsPerPage(value: number) {
    this.dataService.rowsPerPage = value
    this.dataService.loading = true
    setTimeout(() => this.dataService.filterData())
  }

  set page(num) {
    if (num >= 1 && num <= this.total_pages) {
      this.dataService.page = num
      this.dataService.loading = true
      setTimeout(() => this.dataService.filterData())
    }
  }

  get shownPages() {
    let a: number[] = []
    for (let i = this.page - 2; i <= this.page + 2; i++) {
      if (i > 0 && i <= this.total_pages)
        a.push(i)
    }
    return a
  }

  ngOnInit(): void {
    this.dataService.getAllMilitaryDocs()
  }

  uploadINNDocsInfo(col: string, row: { [key: string]: any }) {
    if (this.isChosen(row)) {
      this.dataService.clearINNInfo()
      return
    }
    this.dataService.getOneINNInfo(row['ІПН'])
    setTimeout(() => window.scrollTo(0, 0), 50)
  }

  isChosen(row: { [p: string]: any }): boolean {
    return this.dataService.INN == row['ІПН']
  }

  docType(row: { [p: string]: any }[]) {
    return [...new Set(row.map(type => type[this.docTypeCol]))].join(', ')
  }

  applyFilter(key: string, value: string) {
    if (key === this.docTypeCol) {
      this.dataService.docTypeFilter.military = value
      this.dataService.loading = true
      setTimeout(() => this.dataService.filterData())
      return
    }
    if (key === this.docTypeOtherCol) {
      this.dataService.docTypeFilter.other = value
      this.dataService.loading = true
      setTimeout(() => this.dataService.filterData())
      return
    }

    if (!value) {
      this.dataService.textFilters = this.dataService.textFilters.filter(value => value.col !== key)
      this.dataService.loading = true
      setTimeout(() => this.dataService.filterData())
      return
    }

    this.dataService.textFilters.push({ col: key, value: value.toLowerCase() })
    this.dataService.loading = true
    setTimeout(() => this.dataService.filterData())
  }

  makeExcel() {
    this.dataService.loading = true
    this.dataService.makeExcel([...new Set(this.checkedRows)])
  }

  checkRow(inn: string | undefined) {
    if (inn === undefined) {
      if (this.dataLength === this.checkedRows.length)
        this.checkedRows = []
      else
        this.checkedRows = this.dataService.tableData.map(val => val['ІПН'])
      return
    }

    if (this.checkedRows.includes(inn))
      this.checkedRows = this.checkedRows.filter(val => val !== inn)
    else
      this.checkedRows.push(inn)
  }
}



