import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { DcSendingDocsFiltersService } from '../../services/dc-sending-docs-filters.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'dc-sending-docs-table-filters',
  templateUrl: './dc-sending-docs-table-filters.component.html',
  standalone: true
})
export class DcSendingDocsTableFiltersComponent implements OnInit {
  private readonly sendingDocsFiltersService = inject(DcSendingDocsFiltersService)
  private readonly destroyRef = inject(DestroyRef)
  selectedTab: string = 'downloadDocuments'

  ngOnInit(): void {
    this.sendingDocsFiltersService.getFilteredApplications().pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  selectTab(tab: string): void {
    this.selectedTab = tab
    this.sendingDocsFiltersService.addFilter(tab)
    this.sendingDocsFiltersService.getFilteredApplications().pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  toggleFilter(wayType: string): void {
    this.sendingDocsFiltersService.selectedRowIds$.next([])
    this.sendingDocsFiltersService.toggleWayFilter(wayType)
    this.sendingDocsFiltersService.getFilteredApplications().pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }
}
