import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityHttpService } from '../../services/quality-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';

@Component({
  selector: 'app-show-edited-monitoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-edited-monitoring.component.html',
  styleUrls: ['./show-edited-monitoring.component.css'],
})
export class ShowEditedMonitoringComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  employeeInfoFromUrl = {
    monitoringId: 0,
    role: 0,
  };

  monitoringTable: { [key: string]: any }[] = [];
  monitoringTableHeaders: string[] = [];

  dictionaryTable: { [key: string]: any }[] = [];
  dictionaryTableHeaders: string[] = [];

  penaltiesTable: { [key: string]: any }[] = [];
  penaltiesTableHeaders: string[] = [];
  ngOnInit(): void {
    this.getEmployeeInfoFromUrl();
    this.getLastMonitoring();
  }

  getEmployeeInfoFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.employeeInfoFromUrl.monitoringId = params['MonitoringId'];
        this.employeeInfoFromUrl.role = params['Role'];
      });
  }

  getLastMonitoring() {
    this.qualityHttpService
      .lastMonitoringUser(
        this.employeeInfoFromUrl.role,
        null,
        this.employeeInfoFromUrl.monitoringId
      )
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
}
