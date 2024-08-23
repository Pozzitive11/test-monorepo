import { CommonModule } from '@angular/common'
import { Component, DestroyRef, inject } from '@angular/core'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { QualityCallsPaginationService } from '../../../services/quality-calls-pagination.service'
import { QualityCallsService } from '../../../services/quality-calls.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-quality-calls-pagination',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './quality-calls-pagination.component.html',
  styles: ``
})
export class QualityCallsPaginationComponent {
  collectionSize = 0
  qualityCallsPaginationService = inject(QualityCallsPaginationService)
  private readonly qualityCallsService = inject(QualityCallsService)
  protected destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.qualityCallsPaginationService.calculatePageCredits().subscribe()
    this.qualityCallsService.callsList$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.collectionSize = data.length
    })
  }
}
