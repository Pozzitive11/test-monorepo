import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ResponseParserService {

  parseResponse(textResponse: string): string {
    // Преобразуем escape-последовательности и убираем лишние пробелы между словами
    let normalizedText = textResponse.replace(/\\n/g, '\n').replace(/\s+/g, ' ')
    let mainText = this.extractMainText(normalizedText)
    // Заменяем переводы строк на теги <br>
    mainText = mainText.replace(/\r?\n/g, '<br>')
    mainText = mainText.replace(/(В С Т А Н О В И В:|П О С Т А Н О В И В)/g, '<div class="center-text">$1</div>')
    return mainText.trim()
  }

  private extractMainText(text: string): string {
    const mainTextRegexPatterns = [
      /(?:В С Т А Н О В И В:|П О С Т А Н О В И В:)([\s\S]*?)(?:Суддя:)/
      // Add more patterns here if needed for different formats
    ]

    for (const pattern of mainTextRegexPatterns) {
      const match = pattern.exec(text)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    return text
  }
}
