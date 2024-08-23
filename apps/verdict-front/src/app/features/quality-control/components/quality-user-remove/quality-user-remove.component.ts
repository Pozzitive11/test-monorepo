import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityHttpService } from '../../services/quality-http.service';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserFromDB, UserShortInfo } from '../../models/user.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-quality-user-remove',
  standalone: true,
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './quality-user-remove.component.html',
  styleUrls: ['./quality-user-remove.component.css'],
})
export class QualityUserRemoveComponent implements OnInit {
  private readonly http = inject(QualityHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  userLogin: UserFromDB;
  allUsers: UserFromDB[];
  userShortInfo: UserShortInfo;

  ngOnInit(): void {
    this.http.getAllUsers().subscribe((allUsers) => {
      this.allUsers = allUsers;
    });
  }
  setUserShortInfo(): void {
    if (this.userLogin && this.userLogin.Id) {
      this.http
        .getUserShortInfo(this.userLogin.Id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.userShortInfo = data;
        });
    }
  }

  deleteUser() {
    this.http.deleteUser(this.userLogin.Id).subscribe(() => {
      this.messageService.sendInfo('Користувача видалено');
      this.router.navigate(['/quality-control/quality-control-user']);
    });
  }
}
