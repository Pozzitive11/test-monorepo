import { Component, inject, OnInit } from '@angular/core'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { NgFor } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'app-segmentation-type',
  templateUrl: './segmentation-type.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor]
})
export class SegmentationTypeComponent implements OnInit {
  private ccFilters = inject(CcFiltersService)

  selectSegmentationTypes: string[] = []
  segmentationTypes: string[] = [
    'Сегментація за DPD',
    'Сегментація за сумою боргу'
  ]

  ngOnInit(): void {
    this.selectSegmentationTypes = this.ccFilters.selectedSegmentationTypes
    this.sendChangesToFilter()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  selectSegmentationType(segmentationType: string) {
    if (this.isSelected(segmentationType)) {
      this.selectSegmentationTypes = this.selectSegmentationTypes.filter(
        sst => { return sst !== segmentationType }
      )
    } else {
      this.selectSegmentationTypes.push(segmentationType)
    }

    this.sendChangesToFilter()
  }

  clearChosen(clear: boolean) {
    if (clear) this.selectSegmentationTypes = []
    else this.selectSegmentationTypes = this.segmentationTypes

    this.sendChangesToFilter()
  }

  isSelected(reestr: string): boolean {
    for (let selST of this.selectSegmentationTypes) {
      if (selST === reestr) { return true }
    }
    return false
  }

  private sendChangesToFilter() {
    this.ccFilters.selectedSegmentationTypes = this.selectSegmentationTypes
  }

}
