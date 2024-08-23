import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { AutoObjectModel } from '../../../models/auto-object.model'
import { PropertyObjectModel } from '../../../models/property-object.model'
import { NgbModal, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { LrPropertyObjectEditComponent } from '../../edits/lr-property-object-edit/lr-property-object-edit.component'
import { LrAutoObjectEditComponent } from '../../edits/lr-auto-object-edit/lr-auto-object-edit.component'
import { PropertyCheckModel } from '../../../models/property-check.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { LrPropertyObjectCardComponent } from '../lr-property-object-card/lr-property-object-card.component'
import { LrAutoObjectCardComponent } from '../lr-auto-object-card/lr-auto-object-card.component'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-lr-client-objects-card',
  templateUrl: './lr-client-objects-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    NgbTooltip,
    LrAutoObjectCardComponent,
    LrPropertyObjectCardComponent,
    FormatDatePipe
  ]
})
export class LrClientObjectsCardComponent implements OnInit {
  private readonly modalService = inject(NgbModal)
  private readonly dataService = inject(LrDataService)

  @Input() contractId!: number
  @Input() isMortgage!: boolean
  @Input() INN?: string

  get autoObjects(): AutoObjectModel[] | undefined {
    if (this.INN)
      return this.dataService.guarantors[this.INN].AdditionalObjectsInfo.auto

    return this.isMortgage ?
      this.dataService.mortgageObjectsInfo.auto : undefined
  }

  get propertyObjects(): PropertyObjectModel[] | undefined {
    if (this.INN)
      return this.dataService.guarantors[this.INN].AdditionalObjectsInfo.property

    return this.isMortgage ?
      this.dataService.mortgageObjectsInfo.property : undefined
  }

  get propertyCheck(): PropertyCheckModel | undefined {
    if (this.INN)
      return this.dataService.guarantors[this.INN].PropertyCheck

    return undefined
  }

  get loading(): boolean {
    return (
      this.dataService.loading.additionalPropertyInfo
      || this.dataService.loading.mortgagePropertyInfo
      || this.isMortgage && this.dataService.loading.autoMortgageInfo
      || this.dataService.loading.autoAdditionalInfo
    )
  }

  ngOnInit(): void {
    if (!this.isMortgage && this.INN)
      this.dataService.getPropertyCheck(this.contractId, this.INN)

    this.dataService.getCarsObjectsInfo(this.contractId, this.isMortgage, this.INN)
  }


  objectsNotPresent() {
    return (!this.autoObjects || this.autoObjects.length === 0) &&
      (!this.propertyObjects || this.propertyObjects.length === 0)
  }

  editProperty(propertyObject: PropertyObjectModel, index: number) {
    if (!this.dataService.riskGroups)
      this.dataService.getRiskGroups()
    if (!this.dataService.moratoriumReasons)
      this.dataService.getMoratoriumReasons()

    const modalRef = this.modalService.open(
      LrPropertyObjectEditComponent,
      {
        centered: true,
        scrollable: true,
        size: 'lg'
      }
    )
    modalRef.componentInstance.propertyObject = { ...propertyObject }
    modalRef.componentInstance.isMortgage = this.isMortgage
    modalRef.componentInstance.riskGroups = this.dataService.riskGroups
    modalRef.componentInstance.moratoriumReasons = this.dataService.moratoriumReasons
    modalRef.result
      .then(propObj => {
        if (this.propertyObjects)
          this.propertyObjects[index] = propObj
      })
      .catch(() => {})
  }

  editAuto(auto: AutoObjectModel, index: number) {
    const modalRef = this.modalService.open(
      LrAutoObjectEditComponent,
      {
        centered: true,
        scrollable: true,
        size: 'lg'
      }
    )
    modalRef.componentInstance.autoObject = { ...auto }
    modalRef.componentInstance.isMortgage = this.isMortgage
    modalRef.result
      .then(autoObj => {
        if (this.autoObjects)
          this.autoObjects[index] = autoObj
      })
      .catch(() => {})
  }

  checkDateIsReal() {
    return this.propertyCheck?.CheckDate && (this.propertyCheck.CheckDate > new Date('2000-01-01'))
  }
}
