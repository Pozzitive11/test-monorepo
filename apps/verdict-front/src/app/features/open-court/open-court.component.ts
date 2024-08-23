import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CourtCardsComponent } from './components/court-cards/court-cards.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MiniCourtCard, FullCourtCard } from './models/court-cards.model';
import { CourtDataService, UserCasesType } from './services/court-data.service';
import { PlaintiffService } from './services/plaintiff.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderOpencourtComponent } from './components/header-open-court/header-open-court.component';
import { OpenCourtFiltersComponent } from './components/open-court-filters/open-court-filters.component';
import { MiniCourtCardComponent } from './components/court-cards/court-mini-cards/court-mini-cards.component';
import { ExecutiveProceedingsComponent } from './executive-proceedings/executive-proceedings.component';

@Component({
  selector: 'app-open-court',
  templateUrl: './open-court.component.html',
  styleUrls: ['./open-court.component.css'],
  standalone: true,
  imports: [
    HeaderOpencourtComponent,
    OpenCourtFiltersComponent,
    MatTooltipModule,
    MatIconModule,
    RouterModule,
    NgIf,
    FormsModule,
    NgFor,
    NgxSpinnerModule,
    CommonModule,
    MiniCourtCardComponent,
    ExecutiveProceedingsComponent,
  ],
})
export class OpenCourtComponent {
  @ViewChild('cardRow') cardRow!: ElementRef;

  activeTab: 'main' | 'instances' = 'main';
  courtDataList: MiniCourtCard[] = [];
  dropdowns: { [key: string]: boolean } = {
    court: false,
    region: false,
    category: false,
    sumFilter: false,
    participantFilter: false,
    dates: false,
    sortfilters: false,
    personalCabinet: false,
    justiceKind: false,
  };
  @Input() caseNumberIds: number[] = [];
  currentView = 'cards';
  filteredCourtDataList: any[] = [];
  sortByOptions = ['Датою', 'Суд', 'Суддя'];
  selectedSortBy = this.sortByOptions[0];
  ascendingSort = true;
  id: number;

  private readonly modalService = inject(NgbModal);
  isModalOpen: boolean;

  constructor(private courtDataService: CourtDataService) {}

  updateCourtDataList(data: MiniCourtCard[]): void {
    this.courtDataList = data;
    console.log(this.courtDataList);
  }

  parseDateString(dateString: string): Date {
    return new Date(dateString);
  }

  filterByNewestDate() {
    this.courtDataList.sort((a, b) => {
      const dateA = this.parseDateString(a.lastDate);
      const dateB = this.parseDateString(b.lastDate);
      return dateB.getTime() - dateA.getTime();
    });
    this.filteredCourtDataList = [...this.courtDataList];
  }

  filterByOldestDate() {
    this.courtDataList.sort((a, b) => {
      const dateA = this.parseDateString(a.lastDate);
      const dateB = this.parseDateString(b.lastDate);
      return dateA.getTime() - dateB.getTime();
    });
    this.filteredCourtDataList = [...this.courtDataList];
  }

  toggleSortDirection() {
    this.ascendingSort = !this.ascendingSort;
    this.sortData();
  }

  sortData() {
    this.dropdowns['sortfilters'] = false;
    if (this.selectedSortBy === 'Датою') {
      this.courtDataList.sort((a, b) => {
        const dateA = new Date(a.lastDate);
        const dateB = new Date(b.lastDate);
        return this.ascendingSort
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    } else if (this.selectedSortBy === 'Судом') {
      this.courtDataList.sort((a, b) => {
        return this.ascendingSort
          ? a.courtName.localeCompare(b.courtName)
          : b.courtName.localeCompare(a.courtName);
      });
    } else if (this.selectedSortBy === 'Суддею') {
      this.courtDataList.sort((a, b) => {
        return this.ascendingSort
          ? a.judge.localeCompare(b.judge)
          : b.judge.localeCompare(a.judge);
      });
    }
  }

  adjustCardHeights(): void {
    const cardRowElement = this.cardRow.nativeElement as HTMLElement;
    const cardColumns = Array.from(
      cardRowElement.querySelectorAll('.col-md-4')
    ) as HTMLElement[];

    const rows: HTMLElement[][] = [];
    let currentRow: HTMLElement[] = [];

    cardColumns.forEach((column, index) => {
      currentRow.push(column);
      if ((index + 1) % 3 === 0 || index === cardColumns.length - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });

    rows.forEach((row) => {
      const maxHeight = Math.max(...row.map((card) => card.offsetHeight)) - 500;
      row.forEach((card) => {
        card.style.height = `${maxHeight}px`;
      });
    });
  }

  toggleDropdown(filterKey: string): void {
    Object.keys(this.dropdowns).forEach((key) => {
      if (key !== filterKey) {
        this.dropdowns[key] = false;
      }
    });
    this.dropdowns[filterKey] = !this.dropdowns[filterKey];
  }

  openModal(miniCourtData: MiniCourtCard): void {
    const modalRef = this.modalService.open(CourtCardsComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    modalRef.componentInstance.fullCourtData = miniCourtData;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  switchView(view: string) {
    this.currentView = view;
  }

  exportDataToExcel(): void {
    if (this.courtDataList && this.courtDataList.length > 0) {
      const filteredData = this.courtDataList.map((item) => ({
        caseNumber: item.caseNumber,
        courtName: item.courtName,
        judge: item.judge,
        defendant: item.defendant,
        plaintiff: item.plaintiff,
        description: item.description,
        lastDate: item.lastDate,
      }));

      const requestData = { data: filteredData };
      this.courtDataService.exportToExcel(requestData).subscribe(
        (data: Blob) => {
          if (data && data instanceof Blob) {
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'court_data.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
          } else {
            console.error('Invalid response data for CSV export:', data);
          }
        },
        (error) => {
          console.error('Error exporting data to CSV:', error);
        }
      );
    } else {
      console.error('No data available for export.');
    }
  }

  switchToMainTab(): void {
    this.activeTab = 'main';
  }

  switchToInstancesTab(): void {
    this.activeTab = 'instances';
  }
}
