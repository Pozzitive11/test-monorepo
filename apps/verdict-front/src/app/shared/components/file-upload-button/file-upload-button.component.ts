import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'file-upload-button',
  templateUrl: './file-upload-button.component.html',
  standalone: true
})
export class FileUploadButtonComponent {
  @Input() id: string = 'inputFile'
  @Input() labelText: string = 'Завантажити файл'
  @Input() title: string = 'Оберіть файл'
  @Input() disabled: boolean = false
  @Input() accept: string[] = ['*']
  @Input() multiple: boolean = false
  @Input() buttonClass: string = 'btn-outline-primary'

  @Output() fileAdded = new EventEmitter<FileList | null>()

  get accepts() {
    return this.accept.join(',')
  }

  onUploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    const fileList: FileList | null = element.files

    this.fileAdded.emit(fileList)
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault()
    if (!event.dataTransfer)
      return

    this.fileAdded.emit(event.dataTransfer.files)
  }
}




