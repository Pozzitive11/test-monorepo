import { ChangeDetectionStrategy} from '@angular/core';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-input-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tag-input-dialog.component.html',
  styleUrls: ['./tag-input-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagInputDialogComponent {
  tagValue: string = ''; // Значення тегу

  constructor(
    public dialogRef: MatDialogRef<TagInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(null); // Скасування введення
  }

  onSaveClick(): void {
    this.dialogRef.close(this.tagValue); // Збереження тегу
  }
}

