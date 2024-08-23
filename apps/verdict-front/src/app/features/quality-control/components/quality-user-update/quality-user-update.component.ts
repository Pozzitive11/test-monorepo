import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityHttpService } from '../../services/quality-http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  UserFromDB,
  UserLead,
  UserRole,
  UserShortInfo,
} from '../../models/user.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-quality-user-update',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './quality-user-update.component.html',
  styleUrls: ['./quality-user-update.component.css'],
})
export class QualityUserUpdateComponent implements OnInit {
  private readonly http = inject(QualityHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly destroyRef = inject(DestroyRef);

  allUsers: UserFromDB[];
  leadsList: UserLead[];
  rolesList: UserRole[];

  userLogin: UserFromDB | null = null;
  userLead: UserLead | null = null;
  userRole: UserRole | null = null;

  userShortInfo: UserShortInfo;

  ngOnInit(): void {
    this.http
      .getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((allUsers) => {
        this.allUsers = allUsers;
      });

    this.http
      .getRolesList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rolesList) => {
        this.rolesList = rolesList;
      });

    this.http
      .getLeadsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((leadsList) => {
        this.leadsList = leadsList;
      });
  }

  selectUser(): void {
    if (this.userLogin && this.userLogin.Id) {
      this.http
        .getUserShortInfo(this.userLogin.Id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.userShortInfo = data;

          if (this.rolesList) {
            this.updateEmployeeRole();
          }
          if (this.rolesList) {
            this.updateEmployeeLead();
          }
        });
    } else {
      this.clearEmployeeInfo();
    }
  }

  updateEmployeeRole() {
    const role = this.rolesList.find((item) => {
      return item.Name === this.userShortInfo['Роль'];
    });
    if (role) {
      this.userRole = role;
    }
  }

  updateEmployeeLead() {
    const lead = this.leadsList.find((item) => {
      return item.FullName === this.userShortInfo['Керівник'];
    });
    if (lead) {
      this.userLead = lead;
    }
  }
  setUserLead(userId: number) {
    // let userLeadObj = {
    //   UserId: userId,
    //   ManagerId: this.userLead.Id
    // }
    // this.http.createUserManager(userLeadObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  clearEmployeeInfo() {
    this.userRole = null;
    this.userLead = null;
  }

  updateEmployee(updateParameter: string) {
    if (this.userLogin) {
      if (updateParameter === 'role' && this.userRole) {
        this.http
          .updateUserRole(this.userLogin.Id, this.userRole.Id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.messageService.sendInfo('Роль користувача змінено');
          });
      }
      if (updateParameter === 'lead' && this.userLead) {
        if (this.userShortInfo['Керівник']) {
          this.http
            .updateUserManager({
              UserId: this.userLogin.Id,
              ManagerId: this.userLead.Id,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.messageService.sendInfo('Керівника змінено');
            });
        } else {
          this.http
            .createUserManager({
              UserId: this.userLogin.Id,
              ManagerId: this.userLead.Id,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.messageService.sendInfo('Керівника змінено');
            });
        }
      }
      // if (updateParameter === 'probation') {
      //   this.employeeProbation = !this.employeeProbation
      //   this.http
      //     .updateUserProbation(this.selectedEmployee[0].Id, this.employeeProbation)
      //     .pipe(takeUntilDestroyed(this.destroyRef))
      //     .subscribe(() => {
      //       if (this.employeeProbation) {
      //         this.messageService.sendInfo('Випробувальний термін розпочато')
      //       } else {
      //         this.messageService.sendInfo('Випробувальний термін завершено')
      //       }
      //     })
      // }
    }
  }
}
