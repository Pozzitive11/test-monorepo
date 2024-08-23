import { Component, inject, Input, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { CaseStagesHttpService } from '../../services/case-stages-http.service'
import { NgFor } from '@angular/common'


@Component({
  selector: 'app-case-table',
  templateUrl: './case-table.component.html',
  styleUrls: ['./case-table.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class CaseTableComponent implements OnInit {
  private http = inject(CaseStagesHttpService)
  private title = inject(Title)

  @Input() name!: string
  count: any
  case_stage: any
  titles: any

  ngOnInit(): void {
    this.http.totalTable(this.name).subscribe(data => {
      this.case_stage = data
      this.count = data.length
      this.titles = 'Total' + ' ' + this.name
      this.title.setTitle(this.titles)
    })
  }

  download() {
    this.http.downloadTotalTable(this.name)
  }
}
