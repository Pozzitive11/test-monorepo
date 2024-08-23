import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QualityHttpService } from '../../services/quality-http.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserShortInfo } from '../../models/user.model';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

interface UpdateEmployeeFlags {
  [key: string]: boolean;
}

@Component({
  selector: 'app-quality-user-view',
  standalone: true,
  imports: [CommonModule, NgMultiSelectDropDownModule],
  templateUrl: './quality-user-view.component.html',
  styleUrls: ['./quality-user-view.component.css'],
})
export class QualityUserViewComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageHandlingService);

  employeeInfoFromUrl = {
    id: 0,
    role: '',
  };
  employeeProbation = false;

  monitoringTable: { [key: string]: any }[] = [];
  monitoringTableHeaders: string[] = [];

  dictionaryTable: { [key: string]: any }[] = [];
  dictionaryTableHeaders: string[] = [];

  penaltiesTable: { [key: string]: any }[] = [];
  penaltiesTableHeaders: string[] = [];

  userShortInfo: UserShortInfo;
  listType = 0;

  updateEmployeeFlags: UpdateEmployeeFlags = {
    isUpdateEmployeeLead: false,
    isUpdateEmployeeRole: false,
    isUpdateEmployeeProbation: false,
  };

  updateEmployeeProperty = {
    userLeadId: 0,
    userRoleId: 0,
  };
  dropdownListRole: { [key: string]: any }[];
  dropdownListLead: { [key: string]: any }[];

  lastMonitoringInfo = false;

  ngOnInit() {
    this.getEmployeeInfoFromUrl();
    this.checkRole();
    this.updateEmployeeInfo();
    this.getLastMonitoring();
  }

  getEmployeeInfoFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.employeeInfoFromUrl.id = params['Id'];
        this.employeeInfoFromUrl.role = params['RoleName'];
      });
  }

  showSelectForUpdate(propertyKey: string) {
    this.updateEmployeeFlags[propertyKey] =
      !this.updateEmployeeFlags[propertyKey];
  }
  getLastMonitoring() {
    this.qualityHttpService
      .lastMonitoringUser(this.listType, +this.employeeInfoFromUrl.id, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.monitoringTable = [data['Monitoring']];
        this.dictionaryTable = [data['Dictionary']];
        this.penaltiesTable = [data['Penalty']];

        if (this.monitoringTable.length > 0) {
          this.monitoringTableHeaders = UtilFunctions.getObjectKeys(
            this.monitoringTable
          );
        }
        if (this.dictionaryTable.length > 0) {
          this.dictionaryTableHeaders = UtilFunctions.getObjectKeys(
            this.dictionaryTable
          );
        }
        if (this.penaltiesTable.length > 0) {
          this.penaltiesTableHeaders = UtilFunctions.getObjectKeys(
            this.penaltiesTable
          );
        }
      });
  }
  updateEmployeeInfo() {
    this.qualityHttpService
      .getUserShortInfo(this.employeeInfoFromUrl.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.userShortInfo = data;
        this.employeeProbation =
          this.userShortInfo['Випробувальний термін'] ===
          'Користувач на випробувальному терміні';
      });
  }

  confirmUpdate() {
    if (this.updateEmployeeFlags['isUpdateEmployeeProbation']) {
      this.employeeProbation = !this.employeeProbation;
      this.qualityHttpService
        .updateUserProbation(
          this.employeeInfoFromUrl.id,
          this.employeeProbation
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.updateEmployeeInfo();
        });
    }
  }

  fireEmployee() {
    this.qualityHttpService
      .fireUser(this.employeeInfoFromUrl.id)
      .subscribe((data) => {
        this.messageService.sendInfo('Користувача звільнено');
      });
  }

  isDateField(fieldName: string): boolean {
    return fieldName === 'Дата проведення оцінки';
  }

  checkRole() {
    if (
      this.employeeInfoFromUrl.role === 'Оператор' ||
      this.employeeInfoFromUrl.role === 'Для запросов'
    ) {
      this.listType = 1;
    } else {
      this.listType = 2;
    }
  }
}
