import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExecutiveProceedingsService } from './exucutive-proceedings.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DvsInfo, MiniExecutiveCard, PrivateAgentsInfo } from '../models/executive-proceedings.model';
import { ExecutiveCardsComponent } from "../components/executive-cards/executive-cards.component";
import { NgFor, NgIf } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { FilterPipe } from "../../../shared/pipes/filter.pipe";
import { ParticipantFilter } from '../models/court-cards.model';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'


@Component({
    selector: 'app-executive-proceedings',
    standalone: true,
    templateUrl: './executive-proceedings.component.html',
    styleUrls: ['./executive-proceedings.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ExecutiveCardsComponent, NgIf, NgFor, FilterPipe,NgxSpinnerModule]
})
export class ExecutiveProceedingsComponent implements OnInit {
  executiveData: MiniExecutiveCard[] = [];
  vp_ordernum: string;
  searchByDVSOrg: boolean = false;
  executorName: string;
  regionName: string;
  openDate: string;
  selectedStatus: string;
  dropdowns: { [key: string]: boolean } = {
    'dvs': false,
    'private': false,
    'dates':false,
    'status':false,
  }
  dvsList: DvsInfo[] = [];
  privateAgentsList: PrivateAgentsInfo[] = [];
  searchQuery: string = '';
  
  selectedDvs: DvsInfo | null = null;
  dvsSearch: string = ''; // Строка для поиска органов ДВС
  selectedDvsName: string = '';
  selectedPrivateName: string = ''; // Здесь будет храниться имя выбранного органа ДВС
  showDvsList: boolean = true;
  showPrivateAgentsList: boolean = true;
  isDropdownOpen: boolean = false;
  selectedFilter: 'dvs' | 'private' = 'dvs';
  privateAgentsSearch: string = '';
  searchByParties: boolean = true;
  participantSearchText: string = '';
  showFilters: boolean = false;
  participantFilters: ParticipantFilter[] = [];

  // Options for participant filters
  combinedFilterOptions = [
    { key: 'plaintiff', name: 'Позивач' },
    { key: 'defendant', name: 'Відповідач' }
  ];

  participantTypes = [
    { id: 1, name: 'Фізична особа' },
    { id: 2, name: 'Юридична особа' }
  ];

  caseNumber: string = '';
  searchByExecutiveParties: boolean = true;
  executiveParticipantSearchText: string = '';
  executiveShowFilters: boolean = false;
  executiveParticipantFilters: ParticipantFilter[] = [];
  executiveFilterOptions = [
    { key: 'creditor', name: 'Стягувач' },
    { key: 'debtor', name: 'Боржник' }
  ];
  executiveParticipantTypes = [
    { id: 1, name: 'Фізична особа' },
    { id: 2, name: 'Юридична особа' }
  ];
  executiveCaseNumber: string = '';
  selectedEntityId: number | null = null;
  vpOrderNums: string[] = [];
  
 
  orgNameIds: string[] = [];
  orgNameType: string | null = null;
  selectedOrgId: number | null = null;
  selectedOrgType: string | null = null
  filteredDvsList: any[] = [];
  filteredPrivateAgentsList: any[] = [];
  
  constructor(private executiveService: ExecutiveProceedingsService,private spinner: NgxSpinnerService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadDvsList();
    this.loadPrivateAgentsList();
  }

  loadDvsList(): void {
    this.executiveService.getDvsData().subscribe(data => {
      this.dvsList = data;
    });
  }
  

  loadPrivateAgentsList(): void {
    this.executiveService.getPrivateAgentsData().subscribe(data => {
      this.privateAgentsList = data;
    });
  }
  onDvsSearchInput(): void {
    this.filteredDvsList = this.dvsList.filter(dvs =>
      dvs.Name.toLowerCase().includes(this.dvsSearch.toLowerCase())
    );
  }

  onPrivateAgentsSearchInput(): void {
    this.filteredPrivateAgentsList = this.privateAgentsList.filter(agent =>
      agent.FIO.toLowerCase().includes(this.privateAgentsSearch.toLowerCase())
    );
  }
  
  onVpOrderNumInput() {
    this.addVpOrderNumFilter();
  }
  addVpOrderNumFilter(): void {
    if (this.vp_ordernum.trim().length > 0 && !this.vpOrderNums.includes(this.vp_ordernum)) {
      this.vpOrderNums.push(this.vp_ordernum.trim());
    }
  }
  removeVpOrderNumFilter(num: string): void {
    this.vpOrderNums = this.vpOrderNums.filter(n => n !== num);
    
  }
  
  getOrgNameById(id: number): string {
    const dvs = this.dvsList.find(d => d.id === id);
    if (dvs) return dvs.Name;

    const privateAgent = this.privateAgentsList.find(a => a.id === id);
    if (privateAgent) return privateAgent.FIO;

    return 'Неизвестно';
  }
  
  getOrgNameTypeName(typeId: string): string {
    console.log('Requested Type ID:', typeId);
    const typeNames: { [key: string]: string } = {
      'dvs': 'Орган ДВС',
      'private': 'Приватний виконавець'
    };
    const name = typeNames[typeId as keyof typeof typeNames] || 'Неизвестно';
    console.log('Type Name:', name);
    return name;
  }
  truncateText(text: string, maxLength: number = 50): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  removeOrgNameIdFilter(): void {
    this.selectedOrgId = null;
  }
  
  removeOrgNameTypeFilter(): void {
    this.selectedOrgType = null;
  }

  

  selectDvs(dvs: DvsInfo): void {
    this.selectedDvsName = dvs.Name;
    this.selectedEntityId = dvs.id;
    this.selectedOrgId = dvs.id;
    this.selectedOrgType = 'dvs';
    this.dropdowns['dvs'] = false;
  }
  
  selectPrivateAgent(agent: PrivateAgentsInfo): void {
    this.selectedPrivateName = agent.FIO;
    this.selectedEntityId = agent.id;
    this.selectedOrgId = agent.id;
    this.selectedOrgType = 'private';
    this.dropdowns['private'] = false;
  }
  

  searchExecutiveData(): void {
    const vpOrderNums = this.vp_ordernum ? [this.vp_ordernum] : [];
    const orgNameIds = this.selectedEntityId !== null && this.selectedEntityId !== undefined ? [this.selectedEntityId] : [];
  
    let orgNameType = 0; 
    if (this.selectedFilter === 'dvs') {
      orgNameType = 649593; // ДВС
    } else if (this.selectedFilter === 'private') {
      orgNameType = 649592; 
    }

    this.spinner.show(); 

    this.executiveService.getExucutiveData(vpOrderNums, orgNameIds, orgNameType)
      .pipe(
        map(data => Array.isArray(data) ? data : [data]),
        catchError(error => {
          console.error('Error fetching executive data:', error);
          this.spinner.hide();
          return of([]); 
        })
      )
      .subscribe(
        data => {
          console.log('Received Data:', data);
          this.executiveData = data;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        error => {
          console.error('Error fetching executive data:', error);
          this.spinner.hide();
        }
      );
  }

  toggleDropdown(filterKey: string): void {
    Object.keys(this.dropdowns).forEach(key => {
      if (key !== filterKey) {
        this.dropdowns[key] = false;
      }
    });
    this.dropdowns[filterKey] = !this.dropdowns[filterKey];
  }

  toggleSearchType(): void {
    this.searchByParties = !this.searchByParties;
  }

  clearParticipantSearch(): void {
    this.participantSearchText = '';
  }

  addParticipantFilter(): void {
    this.participantFilters.push({ role: '', searchBy: 'name', value: '' });
  }

  removeParticipantFilter(index: number): void {
    this.participantFilters.splice(index, 1);
  }

  onSearchTypeChange(index: number, event: any): void {
    this.participantFilters[index].searchBy = event;
    this.participantFilters[index].value = '';
  }

  performSearch(): void {
    console.log('Performing search with criteria:', {
      participantSearchText: this.participantSearchText,
      participantFilters: this.participantFilters,
      caseNumber: this.caseNumber
    });
  }

  toggleExecutiveSearchType(): void {
    this.searchByExecutiveParties = !this.searchByExecutiveParties;
  }

  clearExecutiveParticipantSearch(): void {
    this.executiveParticipantSearchText = '';
  }

  addExecutiveParticipantFilter(): void {
    this.executiveParticipantFilters.push({ role: '', searchBy: 'name', value: '' });
  }

  removeExecutiveParticipantFilter(index: number): void {
    this.executiveParticipantFilters.splice(index, 1);
  }

  onExecutiveSearchTypeChange(index: number, event: any): void {
    this.executiveParticipantFilters[index].searchBy = event;
    this.executiveParticipantFilters[index].value = '';
  }

  performExecutiveSearch(): void {
    console.log('Performing executive search with criteria:', {
      executiveParticipantSearchText: this.executiveParticipantSearchText,
      executiveParticipantFilters: this.executiveParticipantFilters,
      executiveCaseNumber: this.executiveCaseNumber
    });
  }
}
  
  

  
