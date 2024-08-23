import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { dctTypesShortValues } from '../../../models/dc-template-models/dct-types.enum'
import { SwitchCheckboxComponent } from '../../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { SearchableListComponent } from '../../../../../shared/components/searchable-list/searchable-list.component'

@Component({
  selector: 'dct-type-choose',
  templateUrl: './dct-type-choose.component.html',
  standalone: true,
  imports: [SearchableListComponent, SwitchCheckboxComponent]
})
export class DctTypeChooseComponent {
  readonly activeModal = inject(NgbActiveModal)
  @Input() templateTypes: dctTypesShortValues[] = []
  @Input() canCreateRepeatedTemplate: boolean = true

  @Input() selectedDocumentTypes: dctTypesShortValues[] = []

}
