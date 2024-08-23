import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CcSegmentsRpcNcDataService } from '../../services/cc-segments-rpc-nc-data.service'
import { Subscription } from 'rxjs'
import { RpcNcInfoModel } from '../../models/report-models'
import { Router, RouterLink } from '@angular/router'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'cc-segments-rpc-nc-info-table-page',
  templateUrl: './cc-segments-rpc-nc-info-table-page.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    NgbProgressbar,
    DecimalPipe
  ]
})
export class CcSegmentsRpcNcInfoTablePageComponent implements OnInit, OnDestroy {
  private dataService = inject(CcSegmentsRpcNcDataService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)
  private router = inject(Router)

  header: string[] = []
  dataInfo: RpcNcInfoModel[] = []
  dataInfoShown: RpcNcInfoModel[] = []

  dataInfo$?: Subscription
  scrollInfo$?: Subscription
  updating: boolean = true
  rows: number = 50
  page: number = 1

  get totalPages(): number {
    return Math.ceil(this.dataInfo.length / this.rows)
  }

  ngOnInit(): void {
    this.dataInfo$ = this.dataService.rpcNcInfo
      .subscribe(data => {
        this.dataInfo = data.data
        this.header = data.header

        this.showData()
        if (data.data.length === 0)
          this.router.navigate(['callcenter', 'SegmentsRPCNC'])
      })
  }

  ngOnDestroy(): void {
    this.dataInfo$?.unsubscribe()
    this.scrollInfo$?.unsubscribe()
  }

  private showData() {
    setTimeout(() => {
      this.dataInfoShown = this.dataInfo.slice((this.page - 1) * this.rows, this.page * this.rows)
      this.updating = false
    })
  }

  previousPage() {
    if (this.page - 1 >= 1) {
      this.page--
      this.updating = true
      setTimeout(() => this.showData())
    }
  }

  nextPage() {
    if (this.page + 1 <= this.totalPages) {
      this.page++
      this.updating = true
      setTimeout(() => this.showData())
    }
  }

  goToPage(page: number) {
    this.page = page
    this.updating = true
    setTimeout(() => this.showData())
  }

  allPages() {
    let a: number[] = []
    for (let i = this.page - 3; i <= this.page + 3; i++) {
      if (i < 1 || i > this.totalPages) { continue }
      a.push(i)
    }
    return a
  }

  downloadPhones() {
    this.updating = true
    this.httpService.downloadPhonesFromContracts(this.dataInfo.map(value => value.ContractId))
      .subscribe({
        next: (file) => {
          UtilFunctions.downloadXlsx(file, `Телефони з RPC NC`)
        },
        error: error => {
          this.messageService.sendError('Не вдалося завантажити файл із серверу' + <string>error.error.detail)
          this.updating = false
        },
        complete: () => {
          this.updating = false
        }
      })
  }
}












