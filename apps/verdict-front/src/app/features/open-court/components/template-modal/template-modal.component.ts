import { CommonModule } from '@angular/common';
import { CourtDataService } from './../../services/court-data.service';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,FormsModule,CommonModule],
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateModalComponent {
  templateData: any = {}; // Здесь нужно указать тип данных для шаблона

  constructor(
    private courtDataService: CourtDataService,
    public dialogRef: MatDialogRef<TemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.templateData = { ...data }; // Инициализация данных из входных параметров
    }
  }

  // createTemplateAndCloseModal(): void {
  //   if (this.isTemplateDataValid()) {
  //     switch (this.templateData.templateType) {
  //       case '1': // Заява про видачу виконавчого листа
  //         this.createExecutiveLetterTemplate();
  //         break;
  //       // Добавьте обработку других типов шаблонов здесь
  //       default:
  //         console.error('Неизвестный тип шаблона');
  //         break;
  //     }
  //   } else {
  //     console.error('Форма не заполнена корректно.');
  //   }
  // }
  // createTemplateAndCloseModal(): void {
  //   if (this.isTemplateDataValid()) {
  //     this.courtDataService.createExecutiveLetterTemplate(this.templateData).subscribe(
  //       (response) => {
          
  //         this.dialogRef.close(this.templateData); // Закрываем модальное окно и передаем данные
  //       },
  //       (error) => {
  //         console.error('Ошибка при создании шаблона:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Форма не заполнена корректно.');
  //   }
  // }
  createTemplateAndCloseModal(): void {
    if (this.isTemplateDataValid()) {
      const requestData = {
        ...this.templateData,
        claim_from: this.templateData.claim_from ? String(this.templateData.claim_from) : '',
        claim_to: this.templateData.claim_to ? String(this.templateData.claim_to) : '',
        current_day: this.templateData.current_day ? String(this.templateData.current_day) : '',
        current_month: this.templateData.current_month ? String(this.templateData.current_month) : '',
        current_year: this.templateData.current_year ? String(this.templateData.current_year) : '',
        plaintiff: this.templateData.plaintiff ? String(this.templateData.plaintiff) : '',
        plaintiff_address: this.templateData.plaintiff_address ? String(this.templateData.plaintiff_address) : '',
        plaintiff_inn: this.templateData.plaintiff_inn ? String(this.templateData.plaintiff_inn) : '',
        plaintiff_email: this.templateData.plaintiff_email ? String(this.templateData.plaintiff_email) : '',
        plaintiff_telephone: this.templateData.plaintiff_telephone ? String(this.templateData.plaintiff_telephone) : '',
        defendant: this.templateData.defendant ? String(this.templateData.defendant) : '',
        defendant_address: this.templateData.defendant_address ? String(this.templateData.defendant_address) : '',
        defendant_inn: this.templateData.defendant_inn ? String(this.templateData.defendant_inn) : '',
        defendant_email: this.templateData.defendant_email ? String(this.templateData.defendant_email) : '',
        defendant_telephone: this.templateData.defendant_telephone ? String(this.templateData.defendant_telephone) : '',
        absence_reason: this.templateData.absence_reason ? String(this.templateData.absence_reason) : '',
        appointment_day: this.templateData.appointment_day ? String(this.templateData.appointment_day) : '',
        appointment_month: this.templateData.appointment_month ? String(this.templateData.appointment_month) : '',
        appointment_year: this.templateData.appointment_year ? String(this.templateData.appointment_year) : '',
        appointment_hour: this.templateData.appointment_hour ? String(this.templateData.appointment_hour) : '',
        appointment_minute: this.templateData.appointment_minute ? String(this.templateData.appointment_minute) : '',
      };
  
      switch (this.templateData.templateType) {
        case '1': // Заява про видачу виконавчого листа
          this.courtDataService.createExecutiveLetterTemplate(requestData).subscribe(
            (response) => {
              this.downloadFile(response, 'Заява про видачу виконавчого листа');
              this.dialogRef.close(this.templateData);
            },
            (error) => {
              console.error('Ошибка при создании шаблона:', error);
            }
          );
          break;
        case '2': // Заява про видачу копії рішення суду
          this.courtDataService.createCopieDecisionLetterTemplate(requestData).subscribe(
            (response) => {
              this.downloadFile(response, 'Заява про видачу копії рішення суду');
              this.dialogRef.close(this.templateData);
            },
            (error) => {
              console.error('Ошибка при создании шаблона:', error);
            }
          );
          break;
        case '3': // Заява про відкладення розгляду справи
          this.courtDataService.createAdjournmentCaseLetterTemplate(requestData).subscribe(
            (response) => {
              this.downloadFile(response , 'Заява про відкладення розгляду справи');
              this.dialogRef.close(this.templateData);
            },
            (error) => {
              console.error('Ошибка при создании шаблона:', error);
            }
          );
          break;
          case '4': // Заява про розгляд справи без позивача
          this.courtDataService.createConsiderationWithoutPlaintiffTemplate(requestData).subscribe(
            (response) => {
              this.downloadFile(response , 'Заява про розгляд справи без позивача');
              this.dialogRef.close(this.templateData);
            },
            (error) => {
              console.error('Ошибка при создании шаблона:', error);
            }
          );
          break;
        default:
          console.error('Неизвестный тип шаблона');
          break;
      }
    } else {
      console.error('Форма не заполнена корректно.');
    }
  }
  downloadFile(data: Blob, templateName: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}.docx`; // Filename based on selected template
    a.click();
    window.URL.revokeObjectURL(url);
  }

  createExecutiveLetterTemplate(): void {
    // Логика создания шаблона
    // Пример сохранения данных
    this.dialogRef.close(this.templateData); // Закрываем модальное окно и передаем данные
  }

  isTemplateDataValid(): boolean {
    // Проверка на заполнение всех обязательных полей
    return !!this.templateData.to_court && !!this.templateData.applicant;
    // Добавьте проверки для остальных полей здесь
  }

  closeTemplateModal(): void {
    this.dialogRef.close(); // Просто закрываем модальное окно без сохранения данных
  }
}