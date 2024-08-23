import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-confirmation-popover',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,MatInputModule],
  templateUrl: './confirmation-popover.component.html',
  styleUrls: ['./confirmation-popover.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationPopoverComponent {
  @Input() message: string;
  @Input() title: string;
  @Output() confirmed = new EventEmitter<{ tag?: string }>();
  @Input() showButtons: boolean = true;
  addTag: boolean = false;
  tagValue: string = '';

  toggleTagInput(): void {
    this.addTag = !this.addTag;
    this.tagValue = ''; // Сброс значения тега при переключении
  }

  onCancelClick(): void {
    this.confirmed.emit();
  }

  onConfirmClick(): void {
    this.confirmed.emit({ tag: this.tagValue });
  }
  
}