import { Component, Input } from '@angular/core'
import { PropertyInfoFlowModel } from '../../../../models/property-info-flow.model'
import { PropertyInventoryModel } from '../../../../models/property-inventory.model'
import { UtilFunctions } from '../../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../../shared/pipes/format-date.pipe'
import { LrInventoryAuctionCardComponent } from '../../lr-inventory-auction-card/lr-inventory-auction-card.component'
import { NgIf } from '@angular/common'

@Component({
  selector: 'lr-property-sub-card',
  templateUrl: './lr-property-sub-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    LrInventoryAuctionCardComponent,
    FormatDatePipe
  ]
})
export class LrPropertySubCardComponent {
  @Input() propertyObj?: PropertyInfoFlowModel
  @Input() inventoryObject?: PropertyInventoryModel
  shortDescription: boolean = true
  redZoneDays: number = 14

  get basicInfoAbsent() {
    return !this.inventoryObject?.AuctionStatusStop && !this.inventoryObject?.InventoryIsDone
  }

  get landRegistryRequestRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.LandRegistryNoRequestDays || 0) > this.redZoneDays
  }

  get landRegistryNoRequestInfo() {
    return this.basicInfoAbsent && this.propertyObj?.LandRegistryNoRequestDays
  }

  get landRegistryResponseRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.LandRegistryNoResponseDays || 0) > this.redZoneDays
  }

  get landRegistryNoResponseInfo() {
    return this.basicInfoAbsent && this.propertyObj?.LandRegistryNoResponseDays
  }

  get CNAPRequestRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.CNAPNoRequestDays || 0) > this.redZoneDays
  }

  get CNAPNoRequestInfo() {
    return this.basicInfoAbsent && this.propertyObj?.CNAPNoRequestDays
  }

  get CNAPResponseRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.CNAPNoResponseDays || 0) > this.redZoneDays
  }

  get CNAPNoResponseInfo() {
    return this.basicInfoAbsent && this.propertyObj?.CNAPNoResponseDays
  }

  get BTIRequestRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.BTINoRequestDays || 0) > this.redZoneDays
  }

  get BTINoRequestInfo() {
    return this.basicInfoAbsent && this.propertyObj?.BTINoRequestDays
  }

  get BTIResponseRedZone() {
    return this.basicInfoAbsent && (this.propertyObj?.BTINoResponseDays || 0) > this.redZoneDays
  }

  get BTINoResponseInfo() {
    return this.basicInfoAbsent && this.propertyObj?.BTINoResponseDays
  }

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }

}
