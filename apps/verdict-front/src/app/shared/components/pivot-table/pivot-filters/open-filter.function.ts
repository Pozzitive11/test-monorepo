import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PivotFiltersComponent } from './pivot-filters.component'
import { TValue } from '../../../models/basic-types'

export const openFilterModal = (
  column: string,
  modalService: NgbModal,
  columnValues: TValue[],
  selectedValues: string[],
  callback: (newFilters: string[]) => void
) => {
  const modalRef = modalService.open(
    PivotFiltersComponent,
    {
      centered: true,
      scrollable: true,
      size: '500px'
    }
  )
  const componentInstance = modalRef.componentInstance as PivotFiltersComponent

  componentInstance.columnName = column
  componentInstance.columnValues = columnValues
  componentInstance.selectedValues = selectedValues

  modalRef.result.then(callback).catch(() => {})
}
