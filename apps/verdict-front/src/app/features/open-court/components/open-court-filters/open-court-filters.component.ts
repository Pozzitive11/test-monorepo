import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  CourtDataService,
  ParticipantType,
} from '../../services/court-data.service';
import {
  MiniCourtCard,
  ParticipantFilter,
} from '../../models/court-cards.model';
import {
  Category,
  Court,
  JusticeKind,
  Region,
} from '../../models/filters.model';
import { FilterDataService } from '../../services/filter.service';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { MessageHandlingService } from 'apps/verdict-front/src/app/shared/services/message-handling.service';

@Component({
  selector: 'app-open-court-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule, FilterPipe],
  templateUrl: './open-court-filters.component.html',
  styleUrls: ['./open-court-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenCourtFiltersComponent implements OnInit {
  @Output() searchCompleted = new EventEmitter<MiniCourtCard[]>();
  public searchByParties = true;
  showFiltersOnDropdownOpen = true;
  participantSearchText = '';
  participantFilters: ParticipantFilter[] = [];
  showFilters = false;
  searchCriteria: any = {
    case_ids: [],
    case_numbers: [],
    court_numbers: [],
    judge_names: [],
    region_codes: [],
    all_participants: [],
    plaintiffs: [],
    plaintiffs_types: [],
    defendants: [],
    defendants_types: [],
    third_persons: [],
    thirds_person_types: [],
    appellants: [],
    appellants_types: [],
    cassants: [],
    cassants_types: [],
    descriptions: [],
    case_types: [],
    start_date: null,
    end_date: null,
    start_sum: null,
    end_sum: null,
  };
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
  caseNumber = '';
  courtDataList: MiniCourtCard[] = [];
  @ViewChild('cardRow') cardRow!: ElementRef;
  combinedFilterOptions = [
    { key: 'plaintiffs', name: 'Позивач', checked: false },
    { key: 'defendants', name: 'Відповідач', checked: false },
    { key: 'third_persons', name: 'Третя особа', checked: false },
    { key: 'appellants', name: 'Апелянт', checked: false },
    { key: 'cassants', name: 'Касант', checked: false },
  ];
  participantTypes: ParticipantType[] = [];
  selectedFilter: string | null = null;
  courtSearch: string = '';
  showCourtList: boolean = false;
  courts: Court[] = [];
  selectedCourtName: string | null = null;
  judgeSearch: string = '';
  regionSearch: string = '';
  showRegionList: boolean = false;
  regions: Region[] = [];
  selectedRegions: Region[] = [];
  categorySearch: string = '';
  justiceKinds: JusticeKind[] = [];
  filteredCategories: Category[] = [];
  categories: Category[] = [];
  categories1: Category[] = [];
  categories2: Category[] = [];
  categories3: Category[] = [];
  categories4: Category[] = [];
  categories5: Category[] = [];
  selectedJusticeKind: JusticeKind | null = null;
  selectedCaseTypes: string[] = [];
  sumSearch: string = '';
  startSum: null;
  endSum: null;
  shouldApplyFilters: boolean = false;
  caseNumberFilter: boolean;
  activeFilters: string[] = [];
  filterInputs: { [key: string]: string } = {
    plaintiffs: '',
    defendants: '',
    third_persons: '',
    appellants: '',
    cassants: '',
  };
  periodSearch: string = '';
  i: number = 0;
  selectedCaseTypeName: string[] | null = null;

  constructor(
    private messageService: MessageHandlingService,
    private spinner: NgxSpinnerService,
    private courtDataService: CourtDataService,
    private filterDataService: FilterDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCourts();
    this.loadRegions();
    this.loadCategories();
  }

  toggleSearchType() {
    this.searchByParties = !this.searchByParties;
    if (this.searchByParties) {
      this.resetFilters();
      this.showFiltersOnDropdownOpen = true;
    } else {
      this.messageService.sendInfo('Обрано пошук за номером справи');
    }
  }

  loadCategories(): void {
    this.filterDataService.getJusticeKind().subscribe((data: any) => {
      this.categories = data.justice_kinds?.map((item: any) => ({
        justice_kind: item.justice_kind,
        name: item.name,
        checked: false, // Инициализируем свойство checked для отслеживания выбранных чекбоксов
      }));
    });
  }

  performSearch(): void {
    if (
      this.searchByParties &&
      (this.participantSearchText.trim() !== '' || this.showFilters)
    ) {
      this.performSearchWithFilters();
    } else {
      const requiredFilters = [
        'region_codes',
        'end_date',
        'start_date',
        'court_numbers',
        'startSum',
        'end_sum',
        'judge_names',
      ];
      const numSelectedFilters = requiredFilters.filter(
        (filter) =>
          this.searchCriteria[filter] && this.searchCriteria[filter].length > 0
      ).length;

      if (numSelectedFilters === 1) {
        this.messageService.sendError(
          'За вашим запитом знайдено забагато результатів, додайте більше інформації для пошуку.'
        );
        return;
      }

      this.spinner.show();
      this.dropdowns['judge'] = false;
      this.searchCriteria.case_numbers =
        this.caseNumber.trim() === '' ? [] : [this.caseNumber.trim()];

      Object.keys(this.searchCriteria).forEach((key) => {
        if (
          typeof this.searchCriteria[key] !== 'object' &&
          !['start_date', 'end_date', 'start_sum', 'end_sum'].includes(key)
        ) {
          this.searchCriteria[key] = this.searchCriteria[key]
            ? [this.searchCriteria[key]]
            : [];
        }
      });
      this.courtDataService.getCourtData(this.searchCriteria).subscribe({
        next: (data: MiniCourtCard[]) => {
          this.searchCompleted.emit(data);
          this.cdr.detectChanges();
          this.spinner.hide();
        },

        error: (error: any) => {
          console.error('Error during search:', error);
        },
      });
      // this.courtDataService.getCourtData(this.searchCriteria).subscribe({
      //   next: (data: any) => {
      //     this.courtDataList = data;
      //     this.cdr.detectChanges();
      //     this.spinner.hide();
      //     this.adjustCardHeights();

      //     if (this.courtDataList.length === 0) {
      //       this.messageService.sendError('За вашим запитом результатів не знайдено, додайте більше інформації для пошуку.');
      //     }
      //   },
      //   error: (error: any) => {
      //     console.error('Error during search:', error);
      //     this.spinner.hide();
      //   }
      // });

      if (!this.caseNumber.trim()) {
        this.searchCriteria.case_numbers = [];
      }
    }
  }

  performSearchWithFilters(): void {
    const selectedParticipants: { [key: string]: string[] } = {};
    this.searchCriteria.all_participants =
      this.participantSearchText.trim() === ''
        ? []
        : [this.participantSearchText.trim()];
    this.dropdowns['judge'] = false;
    this.showFilters = false;

    this.participantFilters.forEach((filter) => {
      if (typeof filter.value === 'string' && filter.value.trim() !== '') {
        const roleName =
          filter.searchBy === 'type' ? `${filter.role}_types` : filter.role;
        const selectedValue =
          filter.searchBy === 'type'
            ? [filter.value.trim()]
            : [filter.value.trim()];

        if (!selectedParticipants[roleName]) {
          selectedParticipants[roleName] = [];
        }
        selectedParticipants[roleName] =
          selectedParticipants[roleName].concat(selectedValue);
      }
    });

    const newSearchCriteria = {
      ...this.searchCriteria,
      ...selectedParticipants,
    };

    this.spinner.show();
    this.courtDataService.getCourtData(newSearchCriteria).subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          this.courtDataList = [];
          this.spinner.hide();
          const selectedParticipantNames =
            Object.values(selectedParticipants).flat();
          const errorMessage = `Наступні учасники не знайдені: ${selectedParticipantNames.join(
            ', '
          )}`;
          this.messageService.sendError(errorMessage);
          return;
        }

        const notFoundParticipants: string[] = [];

        this.participantFilters.forEach((filter) => {
          const formattedName = filter.value.trim().toLowerCase();
          if (
            filter.value.trim() !== '' &&
            !data.find(
              (item) =>
                item.plaintiff.some((p: any) =>
                  p.NAME.trim().toLowerCase().includes(formattedName)
                ) ||
                item.defendant.some((d: any) =>
                  d.NAME.trim().toLowerCase().includes(formattedName)
                )
            )
          ) {
            notFoundParticipants.push(filter.value.trim());
          }
        });

        if (notFoundParticipants.length > 0) {
          const errorMessage = `Наступні учасники не знайдені: ${notFoundParticipants.join(
            ', '
          )}`;
          this.messageService.sendError(errorMessage);
          this.spinner.hide();
          return;
        }

        this.courtDataList = data;
        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Error during search:', error);
        this.spinner.hide();
      },
    });
    this.resetFilters();
  }

  resetFilters() {
    this.participantSearchText = '';
    this.participantFilters = [];
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

  clearParticipantSearch() {
    if (this.showFilters) {
      this.participantSearchText = '';
      this.addParticipantFilter();
    }
  }

  addParticipantFilter(): void {
    this.participantFilters.push({
      role: this.combinedFilterOptions[0].key,
      searchBy: 'name',
      value: '',
    });
  }

  onSearchTypeChange(index: number, selectedValue: string): void {
    const filter = this.participantFilters[index];
    filter.searchBy = selectedValue === 'type' ? 'type' : 'name';
  }

  removeParticipantFilter(index: number): void {
    this.participantFilters.splice(index, 1);
  }

  selectFilter(filter: string) {
    this.selectedFilter = this.selectedFilter === filter ? null : filter;
  }

  onCourtSearchInput(): void {
    this.showCourtList = this.courtSearch.trim().length > 0;
  }

  loadCourts(): void {
    this.filterDataService.getCourts().subscribe((data) => {
      this.courts = data;
    });
  }

  selectCourt(court: any): void {
    if (!this.searchCriteria.court_numbers) {
      this.searchCriteria.court_numbers = [];
    }
    this.searchCriteria.court_numbers.push(court.court_code);
    this.selectedCourtName = court.name;
  }

  onJudgeSearchInput(): void {
    this.searchCriteria.judge_names =
      this.judgeSearch.trim() !== '' ? [this.judgeSearch.trim()] : [];
  }

  onRegionSearchInput(): void {
    this.showRegionList = this.regionSearch.trim().length > 0;
  }

  loadRegions(): void {
    this.filterDataService.getRegions().subscribe((data) => {
      this.regions = data;
    });
  }

  selectRegion(region: any): void {
    const index = this.searchCriteria.region_codes.indexOf(region.region_code);
    if (index === -1) {
      this.searchCriteria.region_codes.push(region.region_code);
    } else {
      this.searchCriteria.region_codes.splice(index, 1);
    }
    this.selectedRegions.push(region);
  }

  onCategorySearchInput(): void {
    const searchText = this.categorySearch.toLowerCase();
    this.justiceKinds.forEach((justiceKind) => {
      justiceKind.categoryCount = 0;
    });
    const filteredCategories: Category[] = [];
    this.justiceKinds.forEach((justiceKind) => {
      const categoriesForJusticeKind =
        this.getCategoriesForJusticeKind(justiceKind);
      const filtered = categoriesForJusticeKind.filter((category) =>
        Object.values(category).some(
          (value) =>
            value &&
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText)
        )
      );
      filteredCategories.push(...filtered);
      filtered.forEach((category) => {
        justiceKind.categoryCount++;
      });
    });
    this.filteredCategories = filteredCategories;
  }

  getCategoriesForJusticeKind(justiceKind: JusticeKind): Category[] {
    let categories: Category[] = [];
    switch (justiceKind.justice_kind) {
      case 1:
        categories = this.categories1;
        break;
      case 2:
        categories = this.categories2;
        break;
      case 3:
        categories = this.categories3;
        break;
      case 4:
        categories = this.categories4;
        break;
      case 5:
        categories = this.categories5;
        break;
      default:
        break;
    }
    return categories.filter((category) =>
      category.name.toLowerCase().includes(this.categorySearch.toLowerCase())
    );
  }

  toggleSubMenu(justiceKind: JusticeKind): void {
    this.selectedJusticeKind =
      this.selectedJusticeKind === justiceKind ? null : justiceKind;
    this.getCategories(justiceKind.justice_kind);
  }

  getCategories(justiceKind: number): void {}

  selectCategory(category: Category): void {
    category.checked = !category.checked;
    if (category.checked) {
      this.selectedCaseTypes.push(category.name);
      this.searchCriteria.case_types.push(category.category_code);
    } else {
      const index = this.searchCriteria.case_types.indexOf(
        category.category_code
      );
      if (index !== -1) {
        this.searchCriteria.case_types.splice(index, 1);
      }
    }
    this.closeDropdown('justiceKind');
  }

  toggleDropdown(filterKey: string): void {
    Object.keys(this.dropdowns).forEach((key) => {
      if (key !== filterKey) {
        this.dropdowns[key] = false;
      }
    });
    this.dropdowns[filterKey] = !this.dropdowns[filterKey];
  }

  closeDropdown(dropdownName: string): void {
    this.dropdowns[dropdownName] = false;
  }

  updateSumFilter() {
    this.searchCriteria.start_sum = this.startSum;
    this.searchCriteria.end_sum = this.endSum;
    if (this.shouldApplyFilters) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    this.caseNumberFilter = true;
    this.activeFilters.forEach((filterKey) => {
      if (!(filterKey in this.filterInputs)) {
        this.searchCriteria[filterKey] = [];
      } else {
        const values = this.filterInputs[filterKey]
          .split(' ')
          .filter((value) => value.trim() !== '');
        this.searchCriteria[filterKey] = values;
      }
    });
    this.performSearch();
  }

  getMinDate(): string {
    return '2021-08-25';
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  updateDateFilters(): void {
    if (
      this.searchCriteria.start_date &&
      this.searchCriteria.end_date &&
      this.searchCriteria.start_date > this.searchCriteria.end_date
    ) {
      this.searchCriteria.end_date = this.searchCriteria.start_date;
    }
    if (this.searchCriteria.start_date && this.searchCriteria.end_date) {
      this.closeDropdown('dates');
    }
  }

  togglesDropdown() {
    this.dropdowns['justiceKind'] = !this.dropdowns['justiceKind'];
  }

  removeCaseNumberFilter(): void {
    this.searchCriteria.case_numbers = [];
    this.caseNumberFilter = false;
  }

  removeFilter(filterKey: string): void {
    this.searchCriteria[filterKey] = [];
    const filterOption = this.combinedFilterOptions.find(
      (option) => option.key === filterKey
    );
    if (filterOption) {
      filterOption.checked = false;
    }
    this.selectedCaseTypeName = [];
    this.selectedJusticeKind = null;
  }

  removeCourtFilter(): void {
    this.searchCriteria.court_numbers = [];
    this.selectedCourtName = null;
  }

  removeSelectedRegion(region: any): void {
    const index = this.selectedRegions.indexOf(region);
    if (index !== -1) {
      this.selectedRegions.splice(index, 1);
      const regionIndexInSearchCriteria =
        this.searchCriteria.region_codes.indexOf(region.region_code);
      if (regionIndexInSearchCriteria !== -1) {
        this.searchCriteria.region_codes.splice(regionIndexInSearchCriteria, 1);
      }
    }
  }

  clearJudgeSearch(): void {
    this.judgeSearch = '';
    this.searchCriteria.judge_names = [];
  }

  clearSumFilter(): void {
    this.startSum = null;
    this.endSum = null;
    this.updateSumFilter();
  }

  clearDateFilters(): void {
    this.searchCriteria.start_date = null;
    this.searchCriteria.end_date = null;
    this.updateDateFilters();
  }
}
