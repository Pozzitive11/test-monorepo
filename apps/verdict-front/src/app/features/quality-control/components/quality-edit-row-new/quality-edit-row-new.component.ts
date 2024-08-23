import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityHttpService } from '../../services/quality-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListType } from '../../models/monitoring.models';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-quality-edit-row-new',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './quality-edit-row-new.component.html',
  styleUrls: ['./quality-edit-row-new.component.css'],
})
export class QualityEditRowNewComponent {
  private readonly http = inject(QualityHttpService);
  private readonly messageService = inject(MessageHandlingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  markName: string;
  markCoefficient: number;
  markDescription: string;
  exceededSumOfTheCoefficients = false;

  selectedListType: ListType;
  listTypes = [
    { id: 2, name: 'Лист оцінки співробітників HR' },
    { id: 1, name: 'Лист оцінки операторів' },
  ];
  rowType: string;
  constructor() {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.rowType = params['rowType'];
      });
  }
  changeEditCoefficient() {
    this.exceededSumOfTheCoefficients = false;
  }

  create() {
    if (this.rowType === 'penalty') {
      let editObject = {
        Penalty: this.markCoefficient,
        Name: this.markName,
        Description: this.markDescription,
        ListType: 1,
      };
      this.http
        .createMonitoringPenalty(editObject)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.messageService.sendInfo('Успішне створення');
        });
    }
    if (this.rowType === 'evaluation') {
      let editObject = {
        Coefficient: this.markCoefficient,
        Name: this.markName,
        Description: this.markDescription,
        ListType: this.selectedListType.id,
      };
      this.http
        .createRowMonitoringTable(editObject)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.http
            .getAllMonitoringDictionaries(this.selectedListType.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              error: () => {
                this.exceededSumOfTheCoefficients = true;
                this.http
                  .deleteRowMonitoringTable(data.Id)
                  .pipe(takeUntilDestroyed(this.destroyRef))
                  .subscribe();
              },
              complete: () => {
                this.messageService.sendInfo('Успішне створення');
                this.exceededSumOfTheCoefficients = false;
              },
            });
        });
    }
  }

  back() {
    if (this.rowType === 'penalty') {
      this.router.navigate(['/quality-control/quality-control-penalty']);
    }
    if (this.rowType === 'evaluation') {
      this.router.navigate(['/quality-control/quality-control-evaluation']);
    }
  }
}
