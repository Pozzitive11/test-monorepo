// import { Component, inject } from '@angular/core'
// import { CommonModule } from '@angular/common'

// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
// import { QualityHttpService } from '../../services/quality-http.service'
// import { MessageHandlingService } from 'src/app/shared/services/message-handling.service'
// import { ActivatedRoute, Router } from '@angular/router'
// import { FormsModule } from '@angular/forms'

// @Component({
//   selector: 'app-quality-user-delete',
//   standalone: true,
//   imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule],
//   templateUrl: './quality-user-delete.component.html',
//   styleUrls: ['./quality-user-delete.component.css']
// })
// export class QualityUserDeleteComponent {
//   private readonly http = inject(QualityHttpService)
//   private readonly messageService = inject(MessageHandlingService)

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   dropdownSettingsLogin = {
//     singleSelection: true,
//     idField: 'Id',
//     textField: 'Login',
//     itemsShowLimit: 2,
//     allowSearchFilter: true,
//     enableCheckAll: false,
//     maxHeight: 197
//   }
//   selectedItemsLogin = []
//   dropdownListLogin

//   OnSelectLogin(event) {
//     console.log(this.selectedItemsLogin[0].Id)
//   }

//   onDeSelectLogin(event) {
//     console.log(this.selectedItemsLogin[0].Id)
//   }

//   ngOnInit(): void {
//     this.http.getAllUsers().subscribe({
//       next: (info) => {
//         this.dropdownListLogin = info
//       }
//     })
//   }

//   deleted() {
//     // let objdelete = {
//     //   "Id": this.selectedItemsLogin[0].Id
//     // }
//     // this.http.fireUser(objdelete).subscribe({
//     //   next: (data) => console.log(data),
//     //   complete: async() => {this.messageService.sendInfo("Користувача звільнено");
//     //   this.http.tableUsersList().subscribe({
//     //     next: (info) => {
//     //       this.dropdownListLogin = info
//     //     }
//     //   })
//     //   this.selectedItemsLogin = []
//     //   this.router.navigate(['/quality-control/quality-control-user'])
//     // }
//     // })
//   }
// }
