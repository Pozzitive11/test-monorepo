import { Component, inject, Input, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { CaseStagesHttpService } from '../../services/case-stages-http.service'
import { NgFor } from '@angular/common'

@Component({
  selector: 'app-case-table-max',
  templateUrl: './case-table-max.component.html',
  styleUrls: ['./case-table-max.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class CaseTableMaxComponent implements OnInit {
  private http = inject(CaseStagesHttpService)
  private title = inject(Title)

  @Input() name!: string
  count: any
  case_stage: any
  titles: any

  ngOnInit(): void {
    this.http.maxTable(this.name).subscribe(data => {
      this.count = data.length
      this.case_stage = data
      this.titles = 'Max' + ' ' + this.name
      this.title.setTitle(this.titles)
    })
  }

  download() {
    this.http.downloadMaxTable(this.name)
  }

}
