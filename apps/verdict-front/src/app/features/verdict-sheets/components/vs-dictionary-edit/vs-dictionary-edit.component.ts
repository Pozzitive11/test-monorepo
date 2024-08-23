import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core'
import { ToSignals } from '../../../../shared/utils/typing.utils'
import { IDictionaryEditModel } from './vs-dictionary-edit.component.model'
import { ISheetDictionaryModel } from '../../models/sheet-dictionary.model'
import { TDbServers } from '../../models/vserdict-sheet.types'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { InputInGroupComponent } from '../../../../shared/components/input-in-group/input-in-group.component'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-vs-dictionary-edit',
  standalone: true,
  imports: [
    DefaultDropdownComponent,
    InputInGroupComponent,
    FormsModule
  ],
  templateUrl: './vs-dictionary-edit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VsDictionaryEditComponent implements ToSignals<IDictionaryEditModel> {
  private readonly activeModal = inject(NgbActiveModal)

  dictionary = model.required<ISheetDictionaryModel>()

  canBeSaved = computed(() => {
    const { name, query } = this.dictionary()
    return name && query
  })

  readonly dbList: TDbServers[] = ['56', '64', '68']

  save() { this.activeModal.close(this.dictionary()) }

  cancel() { this.activeModal.dismiss() }

  updateName(name?: string) {
    this.dictionary.update((d) => ({ ...d, name: name || '' }))
  }

  updateDb(db?: TDbServers) {
    this.dictionary.update((d) => ({ ...d, db: db || '56' }))
  }

  updateQuery(query?: string) {
    this.dictionary.update((d) => ({ ...d, query: query || '' }))
  }

}
