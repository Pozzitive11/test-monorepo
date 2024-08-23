import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DcAdditionalDocsFields } from '../../models/dc-additional-docs-fields'
import { dctTypesFullEnum, isDctTypesFullKeys } from '../../models/dc-template-models/dct-types.enum'
import { DcPathsOfDocSendingComponent } from '../dc-paths-of-doc-sending/dc-paths-of-doc-sending.component'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-dc-additional-special-conf',
  templateUrl: './dc-additional-special-conf.component.html',
  standalone: true,
  imports: [NgIf, DcPathsOfDocSendingComponent]
})
export class DcAdditionalSpecialConfComponent {

  @Input() show: boolean = false
  @Input() sendingAddress: string = ''
  @Input() additionalDocsFields: DcAdditionalDocsFields = {
    ...Object.keys(dctTypesFullEnum).reduce((acc, key) => {
      if (!isDctTypesFullKeys(key))
        return acc

      acc[key] = false
      return acc
    }, {} as DcAdditionalDocsFields),
    SendingWays: '',
    PostOfficeAddress: ''
  }

  @Input() pathsOfSending2: { name: string, selected: boolean }[] = [
    { name: 'Подано не як війсковий', selected: false }
  ]

  @Output() additionalDocsChanged = new EventEmitter<DcAdditionalDocsFields>()

  updateAdditionalDocsFields(additionalDocsFields: DcAdditionalDocsFields) {
    this.additionalDocsFields = additionalDocsFields
    this.additionalDocsChanged.emit(this.additionalDocsFields)
  }

  changePaths(newPathsOfSending: string) {
    this.updateAdditionalDocsFields(
      { ...this.additionalDocsFields, IndividualTerm: newPathsOfSending }
    )
  }

  changeSendingAddress() {
    this.updateAdditionalDocsFields(
      { ...this.additionalDocsFields, IndividualTerm: this.sendingAddress }
    )
  }

}
