import { Component, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-court-html-viewer',
  templateUrl: './court-html-viewer.html',
  styleUrls: ['./court-html-viewer.css'],
  standalone: true,
  imports: [FormsModule]
})
export class CourtHtmlViewerComponent {
  private http = inject(HttpClient)
  private domSanitizer = inject(DomSanitizer)
  // ResponseParserService не нужен, его можно удалить, основные преобразования должны на бэке происходить

  docId: string = ''
  safeHtmlContent: SafeHtml = ''

  loadHtml() {
    if (!this.docId.trim()) {
      console.error('ID документа не указан')
      return
    }

    // Отправляем GET-запрос на сервер для получения HTML
    // 105174964 - пример html-ки
    this.http.get<string>(`http://10.11.32.57:8015/api/v0/OpenCourt/text_for_yaroslav?doc_id=${this.docId}`)
      // в subscribe нужно передавать объект с next/error/complete, список функций при обновлении rxjs перестанет работать
      .subscribe({
        next: (data: string) => {
          // Удаляем комментарии из HTML-кода
          data = data.replace(/<!--(?:.+?\s*)+?-->/g, '')
          // Преобразуем полученный HTML-код в нормальный для отображения
          this.safeHtmlContent = this.domSanitizer.bypassSecurityTrustHtml(data)
        },
        error: (error) => {
          console.error('Ошибка при загрузке HTML-кода:', error)
        }
      })
  }
}
