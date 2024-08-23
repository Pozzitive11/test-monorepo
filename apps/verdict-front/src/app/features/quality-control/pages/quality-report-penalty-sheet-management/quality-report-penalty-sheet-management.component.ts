import { Component, DestroyRef, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

import { QualityHttpService } from '../../services/quality-http.service'
import { FormsModule } from '@angular/forms'
import { Router, NavigationExtras } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Penalty } from '../../models/monitoring.models'

@Component({
  selector: 'app-quality-report-penalty-sheet-management',
  standalone: true,
  imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule],
  templateUrl: './quality-report-penalty-sheet-management.component.html',
  styleUrls: ['./quality-report-penalty-sheet-management.component.css']
})
export class QualityReportPenaltyManagementSheetComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  penaltyList: Penalty[]

  ngOnInit(): void {
    this.qualityHttpService
      .getMonitoringPenalties(1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.penaltyList = data
      })
  }

  editPenalty(penalty: Penalty) {
    const queryParams: NavigationExtras = {
      queryParams: {
        id: penalty.Id,
        name: penalty.Name,
        description: penalty.Description,
        coefficient: penalty.Penalty,
        listType: 1,
        rowType: 'penalty'
      }
    }

    this.router.navigate(['/quality-control/edit-row'], queryParams)
  }

  addNewPenalty() {
    const queryParams: NavigationExtras = {
      queryParams: {
        rowType: 'penalty'
      }
    }
    this.router.navigate(['/quality-control/create-row'], queryParams)
  }
}
