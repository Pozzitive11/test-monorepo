import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'

@Component({
  selector: 'dc-search-page',
  templateUrl: './dc-search-page.component.html',
  standalone: true,
  imports: [DefaultDropdownComponent, FormsModule]
})
export class DcSearchPageComponent {
  searchValue: string = ''
  searchType: string = 'НКС'
  searchTypes: ('НКС' | 'ІПН')[] = ['НКС', 'ІПН']

  getPromotionsInfo() {

  }
}
