import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbAlertModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { matchPasswords } from '../../utils/validators';
import { QualityHttpService } from '../../services/quality-http.service';
import { UserLogin, UserRole, UserLead } from '../../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'app-quality-user-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgSelectModule,
  ],
  templateUrl: './quality-user-add.component.html',
  styleUrls: ['./quality-user-add.component.css'],
})
export class QualityUserAddComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  createUserForm: FormGroup;
  usersList: UserLogin[];
  usersRoles: UserRole[];
  leadsList: UserLead[];
  userStatus = [
    {
      value: 1,
      role: 'Працює',
    },
    { value: 2, role: 'Звільнений' },
  ];
  get loginControl(): FormControl {
    return this.createUserForm.get('login') as FormControl;
  }
  get emailControl(): FormControl {
    return this.createUserForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.createUserForm.get('password') as FormControl;
  }
  get confirmPasswordControl(): FormControl {
    return this.createUserForm.get('confirmPassword') as FormControl;
  }
  get userStatusControl(): FormControl {
    return this.createUserForm.get('userStatus') as FormControl;
  }
  get receptionDateControl(): FormControl {
    return this.createUserForm.get('receptionDate') as FormControl;
  }
  // get endDateControl(): FormControl {
  //   return this.createUserForm.get('endDate') as FormControl
  // }
  get roleControl(): FormControl {
    return this.createUserForm.get('userRole') as FormControl;
  }
  get userLeadControl(): FormControl {
    return this.createUserForm.get('userLead') as FormControl;
  }
  get probationControl(): FormControl {
    return this.createUserForm.get('userProbation') as FormControl;
  }
  ngOnInit(): void {
    this.createUserForm = this.formBuilder.group(
      {
        login: [null, [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        userStatus: [null, [Validators.required]],
        receptionDate: ['', [Validators.required]],
        // endDate: [''],
        userRole: [null, [Validators.required]],
        userLead: [null],
        userProbation: [false],
      },
      { validators: matchPasswords }
    );

    this.qualityHttpService
      .getUsersList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.usersList = list;
      });

    this.qualityHttpService
      .getRolesList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((roles) => {
        this.usersRoles = roles;
      });

    this.qualityHttpService
      .getLeadsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((leads) => {
        this.leadsList = leads;
      });
  }
  setUserLead(userId: number) {
    let userLeadObj = {
      UserId: userId,
      ManagerId: this.userLeadControl.value.Id,
    };
    this.qualityHttpService
      .createUserManager(userLeadObj)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  createUser() {
    if (this.createUserForm.valid) {
      const userObj = {
        UserId: this.loginControl.value.id,
        RoleId: this.roleControl.value.Id,
        EmploymentDate: UtilFunctions.formatNgbDate(
          this.receptionDateControl.value,
          '%Y-%m-%d'
        ),
        Probation: this.probationControl.value,
        Email: this.emailControl.value,
        password: this.passwordControl.value,
      };

      this.qualityHttpService.createUser(userObj).subscribe((user) => {
        if (this.userLeadControl.value) {
          this.setUserLead(user.Id);
        }
        this.messageService.sendInfo('Користувача створено');
        this.router.navigate(['/quality-control/quality-control-user']);
      });
    }
  }
}
