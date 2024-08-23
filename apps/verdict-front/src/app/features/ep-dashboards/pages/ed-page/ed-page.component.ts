import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { InputInGroupComponent } from '../../../../shared/components/input-in-group/input-in-group.component'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { ErrorModel } from '../../../../shared/models/error.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { ICachedReportInfoModel } from '../../models/cached-report-info.model'
import { EdHttpService } from '../../services/ed-http.service'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'

@Component({
  selector: 'ed-page',
  templateUrl: './ed-page.component.html',
  imports: [
    RouterOutlet,
    NgbAccordionModule,
    DecimalPipe,
    NgIf,
    LoadingSpinnerComponent,
    NgForOf,
    DatePipe,
    InputInGroupComponent,
    LoadingBarComponent
  ],
  standalone: true
})
export class EdPageComponent implements OnInit {
  private readonly httpService = inject(EdHttpService)
  private readonly messageService = inject(MessageHandlingService)
  readonly router = inject(Router)

  reportsInCache = signal<ICachedReportInfoModel[]>([])
  rawSqlNames = signal<string[]>([])
  limit = signal(0)

  inLoading = signal<string[]>([])

  ngOnInit(): void {
    this.loadInfo()
  }

  loadInfo() {
    this.httpService.getCachedReports().subscribe(reports => this.reportsInCache.set(reports))
    this.httpService.getRawSqlNames().subscribe(names => this.rawSqlNames.set(names))
  }

  endLoading(reportName: string) {
    this.inLoading.update(names => names.filter(name => name !== reportName))
  }

  loadReport(reportName: string, limit: number = 0) {
    const key = `${reportName}__${limit}`
    this.inLoading.update(names => [...names, key])
    this.httpService.loadReportToCache(reportName, limit).subscribe({
      next: (reports) => this.reportsInCache.set(reports),
      error: async (err: ErrorModel) => {
        await this.messageService.alertError(err)
        this.endLoading(key)
      },
      complete: () => this.endLoading(key)
    })
  }

  reloadReport(key: string) {
    this.inLoading.update(names => [...names, key])
    this.httpService.reloadCachedReport(key).subscribe({
      next: (info) => {
        this.reportsInCache
          .update(reports => reports.map(report => report.key === key ? info : report))
      },
      error: async (err: ErrorModel) => {
        await this.messageService.alertError(err)
        this.endLoading(key)
      },
      complete: () => this.endLoading(key)
    })
  }

  deleteReport(key: string) {
    this.inLoading.update(names => [...names, key])
    this.httpService.deleteCachedReport(key).subscribe({
      next: (reports) => this.reportsInCache.set(reports),
      error: async (err: ErrorModel) => {
        await this.messageService.alertError(err)
        this.endLoading(key)
      },
      complete: () => this.endLoading(key)
    })
  }

  formatByteSize(byteSize: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(byteSize) / Math.log(1024))
    return `${(byteSize / Math.pow(1024, index)).toFixed(2)} ${units[index]}`
  }
}
