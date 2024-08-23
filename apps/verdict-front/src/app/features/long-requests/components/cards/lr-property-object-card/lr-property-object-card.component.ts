import { Component, Input } from '@angular/core'
import { PropertyObjectModel, PropertyOwner } from '../../../models/property-object.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-lr-property-object-card',
  templateUrl: './lr-property-object-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalPipe,
    CurrencyPipe,
    FormatDatePipe
  ]
})
export class LrPropertyObjectCardComponent {
  @Input() propertyObject!: PropertyObjectModel
  @Input() isMortgage!: boolean

  hidden: boolean = false

  ownerInfo(owner: PropertyOwner) {
    if (!owner.INN)
      return ''
    if (!owner.FullName)
      return `${owner.INN} (${owner.OwnerType}) - ${owner.PartOfPropertyRight}`

    return `${owner.INN}, ${owner.FullName} (${owner.OwnerType}) - ${owner.PartOfPropertyRight}`
  }
}
