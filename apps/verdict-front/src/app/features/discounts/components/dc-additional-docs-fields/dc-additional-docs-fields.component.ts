import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { DcAdditionalDocsFields } from '../../models/dc-additional-docs-fields'
import {
  dctTypesFullEnum,
  dctTypesFullValues,
  dctTypesUrkToEng,
  isDctTypesFullKeys
} from '../../models/dc-template-models/dct-types.enum'
import { NgFor } from '@angular/common'

@Component({
  selector: 'dc-additional-docs-fields',
  templateUrl: './dc-additional-docs-fields.component.html',
  standalone: true,
  imports: [NgFor]
})
export class DcAdditionalDocsFieldsComponent implements OnInit {
  private readonly messageService = inject(MessageHandlingService)
  private readonly changeDetector = inject(ChangeDetectorRef)

  readonly specEditCols: dctTypesFullValues[] = Object.values(dctTypesFullEnum)

  @Input() fields: DcAdditionalDocsFields = Object.keys(dctTypesFullEnum).reduce((acc, key) => {
    if (!isDctTypesFullKeys(key))
      return acc

    acc[key] = false
    return acc
  }, {} as DcAdditionalDocsFields)
  @Input() row?: { [key: string]: any }

  @Output() fieldChanged = new EventEmitter<DcAdditionalDocsFields>()

  ngOnInit(): void {
    this.fields = Object.keys(this.fields).reduce((acc, key) => {
      if (!isDctTypesFullKeys(key))
        return acc

      if (this.row)
        acc[key] = this.row[dctTypesFullEnum[key]]
      return acc
    }, { ...this.fields })
  }

  toggleShow(dropMenu: HTMLUListElement) {
    !dropMenu.classList.contains('show') ? dropMenu.classList.add('show') : dropMenu.classList.remove('show')
  }

  hideDropdown(dropMenu: HTMLUListElement) {
    dropMenu.classList.remove('show')
  }

  booleanToText(value: boolean | null): string {
    if (value === null)
      return ''
    else if (value)
      return 'так'
    else
      return 'ні'
  }

  changeField(col: dctTypesFullValues, newValue: boolean | null) {
    const key = dctTypesUrkToEng[col]
    if (key === undefined) {
      const error = 'Хтось забув додати новий тип додаткового документа?'
      this.messageService.sendError(error)
      throw new Error(error)
    }

    this.fields[key] = newValue

    this.fieldChanged.emit(this.fields)
    this.changeDetector.detectChanges()
  }

  fieldValue(col: dctTypesFullValues) {
    const key = dctTypesUrkToEng[col]
    if (key === undefined) {
      const error = 'Хтось забув додати новий тип додаткового документа?'
      this.messageService.sendError(error)
      throw new Error(error)
    }

    return this.fields[key]
  }
}
