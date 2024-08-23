import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigationExtras, Router } from '@angular/router'
import { QualityHttpService } from '../../services/quality-http.service'
import { FormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Mark } from '../../models/monitoring.models'

@Component({
  selector: 'app-quality-management-of-evaluation-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './quality-management-of-evaluation-sheet.component.html',
  styleUrls: ['./quality-management-of-evaluation-sheet.component.css']
})
export class QualityManagementOfEvaluationSheetComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  selectedItems = { item_id: 2, item_text: 'Лист оцінки співробітників HR' }
  dropdownList = [
    { item_id: 2, item_text: 'Лист оцінки співробітників HR' },
    { item_id: 1, item_text: 'Лист оцінки операторів' }
  ]
  markList: Mark[]

  ngOnInit(): void {
    this.table(this.selectedItems.item_id)
  }

  table(id: number) {
    this.qualityHttpService
      .getAllMonitoringDictionaries(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.markList = data
      })
  }

  onEditClick(mark: Mark) {
    const queryParams: NavigationExtras = {
      queryParams: {
        id: mark.Id,
        name: mark.Name,
        description: mark.Description,
        coefficient: mark.Coefficient,
        listType: this.selectedItems.item_id,
        rowType: 'evaluation'
      }
    }

    this.router.navigate(['/quality-control/edit-row'], queryParams)
  }

  onCreateNewRow() {
    const queryParams: NavigationExtras = {
      queryParams: {
        rowType: 'evaluation'
      }
    }

    this.router.navigate(['/quality-control/create-row'], queryParams)
  }
}
