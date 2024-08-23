import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { PropertyInventoryModel } from '../../../models/property-inventory.model'
import { LrCarSubCardComponent } from '../inventory-set/lr-car-sub-card/lr-car-sub-card.component'
import { LrPropertySubCardComponent } from '../inventory-set/lr-property-sub-card/lr-property-sub-card.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-inventory-card',
  templateUrl: './lr-inventory-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    LrPropertySubCardComponent,
    LrCarSubCardComponent
  ]
})
export class LrInventoryCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN?: string
  @Input() contractId!: number

  get fullPropertyList(): PropertyInventoryModel[] | undefined {
    return this.dataService.propertyInventoryInfo
  }

  get landList(): PropertyInventoryModel[] | undefined {
    return this.dataService.propertyInventoryInfo?.filter(prop => prop.LandCount > 0)
  }

  get residentialPropertyList(): PropertyInventoryModel[] | undefined {
    return this.dataService.propertyInventoryInfo?.filter(prop => prop.ResidentialPropertyCount > 0)
  }

  get nonResidentialPropertyList(): PropertyInventoryModel[] | undefined {
    return this.dataService.propertyInventoryInfo?.filter(prop => prop.NonResidentialPropertyCount > 0)
  }

  get carPropertyList(): PropertyInventoryModel[] | undefined {
    return this.dataService.propertyInventoryInfo?.filter(prop => prop.CarPropertyCount > 0)
  }

  get loading() {
    return this.dataService.loading.propertyInventoryInfo
  }

  get landCount() {
    return this.dataService.propertyInventoryInfo?.reduce((prev, cur) => prev + cur.LandCount, 0)
  }

  get residentialCount() {
    return this.dataService.propertyInventoryInfo?.reduce((prev, cur) => prev + cur.ResidentialPropertyCount, 0)
  }

  get nonResidentialCount() {
    return this.dataService.propertyInventoryInfo?.reduce((prev, cur) => prev + cur.NonResidentialPropertyCount, 0)
  }

  get carPropertyCount() {
    return this.dataService.propertyInventoryInfo?.reduce((prev, cur) => prev + cur.CarPropertyCount, 0)
  }

  ngOnInit(): void {
    this.dataService.getPropertyInventoryInfo(this.contractId, this.INN)
  }
}
