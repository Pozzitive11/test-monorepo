import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DcMilitaryDocsDataService } from '../../../services/dc-military-docs-data.service';
import { NgFor, NgIf } from '@angular/common';
import {
  NgbAccordionModule,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { DcmDocUploadCardComponent } from '../dcm-doc-upload-card/dcm-doc-upload-card.component';
import { FileUploadComponent } from 'apps/verdict-front/src/app/shared/components/file-upload/file-upload.component';
import { ShortTextPipe } from 'apps/verdict-front/src/app/shared/pipes/short-text.pipe';
interface Document {
  id: number;
  DocName: string;
}

interface DocType {
  DocName: string;
  Children: Document[];
}
@Component({
  selector: 'app-dcm-doc-upload-with-types',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgbAccordionModule,
    FileUploadComponent,
    ShortTextPipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    DcmDocUploadCardComponent,
  ],
  templateUrl: './dcm-doc-upload-with-types.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DcmDocUploadWithTypesComponent {
  protected militaryDataService = inject(DcMilitaryDocsDataService);

  accordionTitle = input<string>();
  isSpouse = input<boolean>(false);
  docTypes = input<DocType[]>([]);

  shown = false;
}
