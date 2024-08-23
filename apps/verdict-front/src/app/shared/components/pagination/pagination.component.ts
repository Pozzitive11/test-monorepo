import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { PaginationService } from '../../services/pagination.service'
import { CommonModule, NgIf } from '@angular/common'
import { NgbPagination, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  imports: [NgbPagination, NgbPaginationPages, NgIf, CommonModule]
})
export class PaginationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  protected paginationService = inject(PaginationService)
  collectionSize = 0
  page = 0
  pageSize = 0

  ngOnInit(): void {
    this.paginationService.calculateNumberOfPages()
    this.paginationService.collectionSize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.collectionSize = data
    })
    this.paginationService.page$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.page = data
    })
    this.paginationService.pageSize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.pageSize = data
    })
  }
}
