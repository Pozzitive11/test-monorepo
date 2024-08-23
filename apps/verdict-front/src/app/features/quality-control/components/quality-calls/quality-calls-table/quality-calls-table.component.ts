import { Component, DestroyRef, OnInit, inject } from '@angular/core'
import { QualityCallsService } from '../../../services/quality-calls.service'
import { CommonModule } from '@angular/common'
import { QualityCallsPaginationComponent } from '../quality-calls-pagination/quality-calls-pagination.component'
import { QualityCallsPaginationService } from '../../../services/quality-calls-pagination.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { Call } from '../../../models/calls.model'
import { NavigationExtras, Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-quality-calls-table',
  standalone: true,
  imports: [CommonModule, QualityCallsPaginationComponent, FormsModule, RouterModule],
  templateUrl: './quality-calls-table.component.html',
  styles: `
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .table thead th {
      white-space: nowrap;
    }
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityCallsTableComponent implements OnInit {
  protected qualityCallsService = inject(QualityCallsService)
  protected qualityCallsPaginationService = inject(QualityCallsPaginationService)
  private destroyRef = inject(DestroyRef)
  private readonly router = inject(Router)
  ngOnInit(): void {
    this.qualityCallsPaginationService
      .calculatePageCredits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {})
  }

  onFilterChange(columnName: string, searchTerm: any) {
    this.qualityCallsService.searchInColumn(columnName, searchTerm.value)
  }
}
