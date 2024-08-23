import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { QualityHttpService } from '../../services/quality-http.service';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListType } from '../../models/monitoring.models';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

interface EditedMark {
  Coefficient: string;
  Description: string;
  ListType: string;
  Name: string;
}
@Component({
  selector: 'app-quality-edit-row-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './quality-edit-row-table.component.html',
  styleUrls: ['./quality-edit-row-table.component.css'],
})
export class QualityEditRowTableComponent implements OnInit {
  private readonly qualityHttpService = inject(QualityHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  markId: number;
  markName: string;
  markCoefficient: string;
  markDescription: string;

  selectedListType: ListType;
  listTypes = [
    { id: 1, name: 'Лист оцінки операторів' },
    { id: 2, name: 'Лист оцінки співробітників HR' },
  ];
  listType: string;
  exceededSumOfTheCoefficients = false;
  lastEditedValue: EditedMark;
  rowType: string;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.rowType = params['rowType'];
      });

    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.markId = params['id'];
        this.markName = params['name'];
        this.markDescription = params['description'];
        this.markCoefficient = params['coefficient'];
        this.listType = params['listType'];

        this.checkListType();
      });
    this.calculateSumOfTheCoefficients();
    this.lastEditedValue = {
      Coefficient: this.markCoefficient,
      Description: this.markDescription,
      ListType: this.listType,
      Name: this.markName,
    };
  }

  calculateSumOfTheCoefficients() {
    this.qualityHttpService
      .getAllMonitoringDictionaries(this.selectedListType.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log(this.markCoefficient);
      });
  }

  checkListType() {
    if (this.listType === '1') {
      this.selectedListType = { id: 1, name: 'Лист оцінки операторів' };
    } else {
      this.selectedListType = { id: 2, name: 'Лист оцінки співробітників HR' };
    }
  }

  update() {
    if (this.rowType === 'evaluation') {
      let editObject = {
        Coefficient: this.markCoefficient,
        Name: this.markName,
        Description: this.markDescription,
        ListType: this.selectedListType.id,
      };
      this.qualityHttpService
        .updateRowMonitoringTable(this.markId, editObject)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.qualityHttpService
              .getAllMonitoringDictionaries(this.selectedListType.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                error: () => {
                  this.exceededSumOfTheCoefficients = true;
                  this.qualityHttpService
                    .updateRowMonitoringTable(this.markId, this.lastEditedValue)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
                },
                complete: () => {
                  this.messageService.sendInfo('Успішне редагування');
                  this.exceededSumOfTheCoefficients = false;
                },
              });
          },
        });
    }
    if (this.rowType === 'penalty') {
      let editObject = {
        Penalty: this.markCoefficient,
        Name: this.markName,
        Description: this.markDescription,
        ListType: 1,
      };

      this.qualityHttpService
        .updateMonitoringPenalty(this.markId, editObject)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.messageService.sendInfo('Успішне редагування');
        });
    }
  }

  deleteRow() {
    if (this.rowType === 'evaluation') {
      this.qualityHttpService
        .deleteRowMonitoringTable(this.markId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          complete: async () =>
            this.messageService.sendInfo('Успішне видалення'),
        });
    }
    if (this.rowType === 'penalty') {
      this.qualityHttpService
        .deleteMonitoringPenalty(this.markId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          complete: async () =>
            this.messageService.sendInfo('Успішне видалення'),
        });
    }
  }

  back() {
    if (this.rowType === 'evaluation') {
      this.router.navigate(['/quality-control/quality-control-evaluation']);
    }
    if (this.rowType === 'penalty') {
      this.router.navigate(['/quality-control/quality-control-penalty']);
    }
  }
}
