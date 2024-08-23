import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core'
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbAccordionToggle
} from '@ng-bootstrap/ng-bootstrap'
import { VsTableInfoComponent } from '../../../features/verdict-sheets/components/vs-table-info/vs-table-info.component'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [
    NgbAccordionBody,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    NgbAccordionToggle,
    VsTableInfoComponent,
    NgTemplateOutlet
  ],
  templateUrl: './accordion.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent<T> {
  items = input<T[]>([])
  titleKey = input.required<keyof T>()
  trackBy = input.required<keyof T>()
  template = input.required<TemplateRef<any>>()
  collapsed = input<(item: T, index: number) => boolean>(() => true)
  closeOthers = input<boolean>(false)
}
