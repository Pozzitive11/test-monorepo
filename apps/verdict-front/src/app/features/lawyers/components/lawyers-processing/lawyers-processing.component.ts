import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { LawyersFileComponent } from '../lawyers-file/lawyers-file.component'

@Component({
  selector: 'app-lawyers-processing',
  templateUrl: './lawyers-processing.component.html',
  styleUrls: ['./lawyers-processing.component.css'],
  standalone: true,
  imports: [LawyersFileComponent]
})
export class LawyersProcessingComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)

  name: string = ''

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => this.name = params['name'])
  }
}
