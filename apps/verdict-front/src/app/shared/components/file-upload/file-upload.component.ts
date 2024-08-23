import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true
})
export class FileUploadComponent {
  @Input() id: string = 'inputFile'
  @Input() title: string = 'Оберіть або перетягніть файл/и'
  @Input() disabled: boolean = false
  @Input() accept: string[] = ['*']
  @Input() multiple: boolean = false

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
