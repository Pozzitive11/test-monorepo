import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model } from '@angular/core'
import { IColumnInfoModel, ITableInfoModel } from '../../models/query-info.model'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { NgClass } from '@angular/common'
import { InputInGroupComponent } from '../../../../shared/components/input-in-group/input-in-group.component'
import { ModalService } from '../../../../shared/services/modal.service'
import { VsColumnEditComponent } from '../vs-column-edit/vs-column-edit.component'
import { IColumnEditComponentModel } from '../vs-column-edit/vs-column-edit.component.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-vs-selected-columns',
  standalone: true,
  imports: [
    NgbTooltip,
    NgClass,
    InputInGroupComponent
  ],
  templateUrl: './vs-selected-columns.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsSelectedColumnsComponent {
  private readonly modalService = inject(ModalService)
  private readonly destroyRef = inject(DestroyRef)

  selectedColumns = model.required<IColumnInfoModel[]>()
  tables = input.required<ITableInfoModel[]>()

  editColumn(column: IColumnInfoModel) {
    this.modalService.runModalComponent$<IColumnEditComponentModel, VsColumnEditComponent, IColumnInfoModel>(
      { column, tables: this.tables() },
      VsColumnEditComponent,
      { size: 'lg' }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((editedColumn) => {
        if (editedColumn) {
          this.selectedColumns.update((columns) => columns.map((c) => c.alias === column.alias ? editedColumn : c))
        }
      })
  }

  removeColumn(column: IColumnInfoModel) {
    this.selectedColumns.update((columns) => columns.filter((c) => c.alias !== column.alias))
  }
}
