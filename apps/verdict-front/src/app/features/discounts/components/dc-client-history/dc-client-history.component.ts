import { Component, Input } from '@angular/core'
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-dc-client-history',
  templateUrl: './dc-client-history.component.html',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, DatePipe]
})
export class DcClientHistoryComponent {
  @Input() clientHistory: { [key: string]: any }[] = []
  isShow: { [key: string]: boolean } = {}

  show(entryId: string) {
    this.isShow[entryId] = !this.isShow[entryId]
  }

  getDocumentsCount(entry: any) {
    if (entry && entry['Documents']) {
      const validKeys = Object.keys(entry['Documents']).filter((key) => {
        if (key === 'SendingWays' || key === 'PostOfficeAddress') {
          return false
        }

        const value = entry['Documents'][key]
        return value !== null && value !== false && value !== ''
      })

      return validKeys.length
    }
    return 0
  }
}
