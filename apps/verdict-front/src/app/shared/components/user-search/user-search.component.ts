import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UserSearchModel } from '../../models/user-search.model'
import { debounceTime, map, Observable, OperatorFunction } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { NgbHighlight, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  standalone: true,
  imports: [
    NgbHighlight,
    FormsModule,
    NgbTypeahead
  ]
})
export class UserSearchComponent implements OnInit {
  @Input() users: UserSearchModel[] = []
  @Input() title: string = ''
  @Input() inputUser?: UserSearchModel

  selectedUser?: UserSearchModel

  @Output() userSelected = new EventEmitter<UserSearchModel>()

  search: OperatorFunction<string, readonly UserSearchModel[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === '' ? [] : this.users
          .filter(
            (user) => `${user.Login} (${user.FullName})`
              .toLowerCase()
              .indexOf(term.toLowerCase()) > -1
          ).slice(0, 5)
      )
    )

  formatter = (user: UserSearchModel) => `${user.Login} (${user.FullName})`

  ngOnInit(): void {
    if (!!this.inputUser)
      this.selectedUser = this.inputUser
  }

  selectUser(selectedUser: UserSearchModel) {
    this.userSelected.emit(selectedUser)
  }
}
