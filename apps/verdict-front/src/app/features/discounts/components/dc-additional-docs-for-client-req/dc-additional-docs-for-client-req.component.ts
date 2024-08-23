import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DcAdditionalDocsFields } from '../../models/dc-additional-docs-fields'
import { dctTypesFullEnum, isDctTypesFullKeys } from '../../models/dc-template-models/dct-types.enum'
import { FormsModule } from '@angular/forms'
import { DcPathsOfDocSendingComponent } from '../dc-paths-of-doc-sending/dc-paths-of-doc-sending.component'
import { DcAdditionalDocsFieldsComponent } from '../dc-additional-docs-fields/dc-additional-docs-fields.component'
import { NgIf } from '@angular/common'


@Component({
  selector: 'dc-additional-docs-for-client-req',
  templateUrl: './dc-additional-docs-for-client-req.component.html',
  standalone: true,
  imports: [
    NgIf,
    DcAdditionalDocsFieldsComponent,
    DcPathsOfDocSendingComponent,
    FormsModule
  ]
})
export class DcAdditionalDocsForClientReqComponent {
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
  @Input() pathsOfSending: { name: string, selected: boolean }[] = [
    { name: 'Електронна пошта', selected: false },
    { name: 'Нова пошта', selected: false },
    { name: 'Укрпошта', selected: false }
  ]

  @Output() additionalDocsChanged = new EventEmitter<DcAdditionalDocsFields>()

  updateAdditionalDocsFields(additionalDocsFields: DcAdditionalDocsFields) {
    this.additionalDocsFields = additionalDocsFields
    this.additionalDocsChanged.emit(this.additionalDocsFields)
  }

  changePaths(newPathsOfSending: string) {
    this.updateAdditionalDocsFields(
      { ...this.additionalDocsFields, SendingWays: newPathsOfSending }
    )
  }

  changeSendingAddress() {
    this.updateAdditionalDocsFields(
      { ...this.additionalDocsFields, PostOfficeAddress: this.sendingAddress }
    )
  }
}










