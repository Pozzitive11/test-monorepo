import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CaseTableComponent } from '../case-table/case-table.component'


@Component({
  selector: 'app-case-stages',
  templateUrl: './case-stages.component.html',
  styleUrls: ['./case-stages.component.css'],
  standalone: true,
  imports: [CaseTableComponent]
})
export class CaseStagesComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)

  name!: string

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => (this.name = params['name']))
  }
}
