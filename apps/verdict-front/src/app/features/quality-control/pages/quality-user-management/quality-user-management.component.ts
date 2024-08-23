import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationExtras, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { QualityHttpService } from '../../services/quality-http.service';
import { combineLatest, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SubordinatesUser,
  UserFromDB,
  UserRole,
} from '../../models/user.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

type User = UserFromDB | SubordinatesUser;
@Component({
  selector: 'app-quality-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './quality-user-management.component.html',
  styleUrls: ['./quality-user-management.component.css'],
})
export class QualityUserManagementComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageHandlingService);

  userSearchForm: FormGroup;

  subordinatesSearchedUsers: SubordinatesUser[];
  subordinatesUsersList: SubordinatesUser[];
  subordinatesSearchedUsersList: SubordinatesUser[];

  anotherSearchedUsers: UserFromDB[] = [];
  anotherUsersList: UserFromDB[];
  usersRolesList: UserRole[];

  anotherSelectedUsers: UserFromDB[];

  get subordinatesUsersControl(): FormControl {
    return this.userSearchForm.get('subordinatesUsers') as FormControl;
  }
  get subordinatesUserRolesControl(): FormControl {
    return this.userSearchForm.get('subordinatesUserRoles') as FormControl;
  }
  get anotherUsersControl(): FormControl {
    return this.userSearchForm.get('anotherUsers') as FormControl;
  }
  get anotherUserRolesControl(): FormControl {
    return this.userSearchForm.get('anotherUserRoles') as FormControl;
  }

  ngOnInit(): void {
    this.createUserSearchForm();
    this.qualityHttpService
      .getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        this.anotherUsersList = users;
        this.anotherSearchedUsers = users;
      });

    this.qualityHttpService
      .getRolesList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((roles) => {
        this.usersRolesList = roles;
      });

    this.qualityHttpService
      .managersUsersList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((info) => {
        this.subordinatesUsersList = info;
        this.subordinatesSearchedUsers = info;
        this.subordinatesSearchedUsersList = info;
      });

    this.setupSubscriptions();
  }
  setupSubscriptions(): void {
    combineLatest([
      this.subordinatesUsersControl.valueChanges.pipe(
        startWith(this.subordinatesUsersControl.value)
      ),
      this.subordinatesUserRolesControl.valueChanges.pipe(
        startWith(this.subordinatesUserRolesControl.value)
      ),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([subordinatesSelectedUsers, selectedRoles]) => {
        this.subordinatesSearchedUsers =
          this.filterUsersBySelection<SubordinatesUser>(
            this.subordinatesUsersList,
            subordinatesSelectedUsers,
            selectedRoles
          );
      });

    combineLatest([
      this.anotherUsersControl.valueChanges.pipe(
        startWith(this.anotherUsersControl.value)
      ),
      this.anotherUserRolesControl.valueChanges.pipe(
        startWith(this.anotherUserRolesControl.value)
      ),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([anotherSelectedUsers, selectedRoles]) => {
        this.anotherSearchedUsers = this.filterUsersBySelection<UserFromDB>(
          this.anotherUsersList,
          anotherSelectedUsers,
          selectedRoles
        );
      });
  }
  filterUsersBySelection<T extends User>(
    usersList: T[],
    selectedUsers: T[],
    selectedRoles: UserRole[]
  ): T[] {
    if (!selectedUsers.length && !selectedRoles.length) {
      return usersList;
    } else if (selectedUsers.length && !selectedRoles.length) {
      return usersList.filter((user) =>
        selectedUsers.some((selectedUser) => user.Id === selectedUser.Id)
      );
    } else if (!selectedUsers.length && selectedRoles.length) {
      return usersList.filter((user) =>
        selectedRoles.some(
          (selectedRole) => user.RoleName === selectedRole.Name
        )
      );
    } else {
      return usersList.filter(
        (user) =>
          selectedUsers.some((selectedUser) => user.Id === selectedUser.Id) &&
          selectedRoles.some(
            (selectedRole) => user.RoleName === selectedRole.Name
          )
      );
    }
  }

  createUserSearchForm() {
    this.userSearchForm = this.formBuilder.group({
      subordinatesUsers: [[]],
      subordinatesUserRoles: [[]],
      anotherUsers: [[]],
      anotherUserRoles: [[]],
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  navigateToUserPage(user: User) {
    const queryParams: NavigationExtras = {
      queryParams: {
        Id: user.Id,
        Login: user.Login,
        FullName: user.FullName,
        RoleName: user.RoleName,
        EmploymentDate: user.EmploymentDate,
        DismissalDate: user.DismissalDate,
      },
    };

    this.router.navigate(['/quality-control/user-row'], queryParams);
  }

  navigateToCreateMonitoring(user: User) {
    const queryParams: NavigationExtras = {
      queryParams: {
        Id: user.Id,
        Login: user.Login,
        FullName: user.FullName,
        RoleName: user.RoleName,
        EmploymentDate: user.EmploymentDate,
        DismissalDate: user.DismissalDate,
      },
    };

    this.router.navigate(['/quality-control/user-row-edit'], queryParams);
  }

  removeUserFromSubordinates(id: number): void {
    this.qualityHttpService
      .removeSubordinate({ Id: id })
      .pipe(
        switchMap(() => this.qualityHttpService.managersUsersList()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((info) => {
        this.subordinatesSearchedUsersList = info;
        this.subordinatesSearchedUsers = info;
        if (info) {
          this.messageService.sendInfo('Користувача прибрано з підлеглих');
        }
      });
  }

  goToAddUserPage() {
    this.router.navigate(['/quality-control/add-user']);
  }

  goToUpdateUserPage() {
    this.router.navigate(['/quality-control/update-user']);
  }

  goToFireUserPage() {
    this.router.navigate(['/quality-control/delete-user']);
  }

  goToRemoveUserPage() {
    this.router.navigate(['/quality-control/remove-user']);
  }
}
