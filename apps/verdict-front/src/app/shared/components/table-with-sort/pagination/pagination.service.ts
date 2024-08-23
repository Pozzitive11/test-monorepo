import { computed, inject, Injectable, signal } from '@angular/core';
import { TableWithSortService } from '../table-with-sort.service';

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  readonly FILTER_PAG_REGEX = /[^0-9]/g;
  private readonly tableWithSortService = inject(TableWithSortService);

  collectionSize = computed(
    () => this.tableWithSortService.filteredTableData().length
  );
  paginatedData = computed(() => {
    const startIndex = (this.page() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.tableWithSortService
      .filteredTableData()
      .slice(startIndex, endIndex);
  });
  pageSize = signal(PAGE_SIZE);
  page = signal(1);

  selectPage(page: any): void {
    this.page.set(+page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }
}
