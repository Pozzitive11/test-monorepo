import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-participants-filter',
  template: `
    <div>
      <label>
        <input type="checkbox" [(ngModel)]="filters.plaintiff" (change)="updateFilter()"> Позивач
      </label>
      <label>
        <input type="checkbox" [(ngModel)]="filters.respondent" (change)="updateFilter()"> Відповідач
      </label>
      <label>
        <input type="checkbox" [(ngModel)]="filters.thirdPerson" (change)="updateFilter()"> Третя особа
      </label>
      <label>
        <input type="checkbox" [(ngModel)]="filters.appellant" (change)="updateFilter()"> Апелянт
      </label>
      <label>
        <input type="checkbox" [(ngModel)]="filters.cassation" (change)="updateFilter()"> Касант
      </label>
      <input type="text" [(ngModel)]="searchText" placeholder="Пошук..." (input)="updateFilter()">
    </div>
  `,
  standalone: true,
  imports: [FormsModule]
})
export class ParticipantsFilterComponent {
  filters = {
    plaintiff: false,
    respondent: false,
    thirdPerson: false,
    appellant: false,
    cassation: false
  }

  searchText: string = ''

  @Output() filterChanged = new EventEmitter<any>()

  updateFilter() {
    this.filterChanged.emit({ filters: this.filters, searchText: this.searchText })
  }
}
