import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CaseTableMaxComponent } from '../case-table-max/case-table-max.component'

@Component({
  selector: 'app-case-stages-max',
  templateUrl: './case-stages-max.component.html',
  styleUrls: ['./case-stages-max.component.css'],
  standalone: true,
  imports: [CaseTableMaxComponent]
})
export class CaseStagesMaxComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)

  name!: string

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => (this.name = params['name']))
  }
}
