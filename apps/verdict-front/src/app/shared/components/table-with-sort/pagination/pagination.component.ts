import { NgIf, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NgbPagination, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap';
import { PaginationService } from './pagination.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgbPagination, NgbPaginationPages, NgIf, CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  protected paginationService = inject(PaginationService);
}
