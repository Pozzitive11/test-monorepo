import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { RouterLink } from '@angular/router'
import { NgClass, NgFor } from '@angular/common'


@Component({
  selector: 'app-pivot-tables',
  templateUrl: './pivot-tables.component.html',
  styleUrls: ['./pivot-tables.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, RouterLink]
})
export class PivotTablesComponent implements OnInit {
  totalAngularPackages: any
  totalAngularPackages1: any
  public case: any
  private case_sta: any

  constructor(private http: HttpClient, private http1: HttpClient) { }

  CaseStage_Add() {
    this.case_sta = this.case
    console.log(this.case_sta)
    if (this.case_sta === '1') {
      this.http1.get<any>('http://10.11.32.60:8000/api/v0/ArbitrCourt/arbtr/pivot_tables/total/1').subscribe(data1 => {
        this.totalAngularPackages1 = data1
        console.log(this.totalAngularPackages1)
      })
    }
    if (this.case_sta === '2') {
      this.http1.get<any>('http://10.11.32.60:8000/api/v0/ArbitrCourt/arbtr/pivot_tables/total/2').subscribe(data1 => {
        this.totalAngularPackages1 = data1
        console.log(this.totalAngularPackages1)
      })
    }
  }


  ngOnInit() {
    this.http.get<any>('http://10.11.32.60:8000/api/v0/ArbitrCourt/arbtr/pivot_tables').subscribe(data => {
      this.totalAngularPackages = data
      console.log(this.totalAngularPackages)
    })


  }
}

