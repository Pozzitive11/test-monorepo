import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { DcMilitaryDocsDataService } from '../../../services/dc-military-docs-data.service'
import { unsecuredCopyToClipboard } from '../../../../../shared/utils/unsave-clipboard.util'
import { DcmDocsTypeCellComponent } from '../dcm-docs-cells/dcm-docs-type-cell/dcm-docs-type-cell.component'
import { DcmDocsUploadCellComponent } from '../dcm-docs-cells/dcm-docs-upload-cell/dcm-docs-upload-cell.component'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DcmDocsDateCellComponent } from '../dcm-docs-cells/dcm-docs-date-cell/dcm-docs-date-cell.component'
import { DcmDocsCellComponent } from '../dcm-docs-cells/dcm-docs-cell/dcm-docs-cell.component'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dcm-client-info',
  templateUrl: './dcm-client-info.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DcmDocsCellComponent,
    DcmDocsDateCellComponent,
    NgbTooltip,
    DcmDocsUploadCellComponent,
    DcmDocsTypeCellComponent
  ]
})
export class DcmClientInfoComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DcMilitaryDocsDataService)

  INNCols: string[] = [
    'Дата запиту до військової частини',
    'Підтвердження з військової частини',
    'Початок перебування в АТО',
    'Кінець перебування в АТО'
  ]
  dateCols: string[] = [
    'Дата запиту до військової частини',
    'Початок перебування в АТО',
    'Кінець перебування в АТО'
  ]
  pathCol: string = 'Шлях збереження відповіді з в/ч'
  data: { [key: string]: any }[] = []

  clientInfo$?: Subscription

  ngOnInit(): void {
    this.clientInfo$ = this.dataService.clientInfo
      .subscribe(data => this.data = data)
  }

  ngOnDestroy() {
    this.clientInfo$?.unsubscribe()
  }

  getDropdown(key: string): string[] {
    return key === 'Підтвердження з військової частини' ? ['так', 'ні'] : []
  }

  getIdsForINN() {
    return this.data.map(value => value['RequestId'])
  }

  getAllDocsTypesForINN() {
    const docTypes: { [key: string]: any }[] = [
      ...this.data[0][this.dataService.docTypeCol],
      ...this.data[0][this.dataService.docTypeOtherCol]
    ].filter(doc => doc['DocumentId'] != null)
    return docTypes
  }

  copy(text: string, copyThing: HTMLElement) {
    copyThing.classList.remove('bi-clipboard2')
    copyThing.classList.add('bi-clipboard2-check')
    navigator.clipboard.writeText(text)
      .catch(() => unsecuredCopyToClipboard(text))
    setTimeout(() => {
      copyThing.classList.remove('bi-clipboard2-check')
      copyThing.classList.add('bi-clipboard2')
    }, 2_000)
  }

  openLocation(filePath: string) {
    filePath = filePath.split(/[\\/]/).slice(0, -1).join('\\')
    window.open(filePath, '_blank')
  }

}
