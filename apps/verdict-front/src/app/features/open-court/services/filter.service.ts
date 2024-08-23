import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category, CategoryResponse, Court, CourtResponse, JusticeKind, JusticeKindResponse, Region, RegionResponse } from "../models/filters.model";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class FilterDataService {
    private url: string = 'http://dev.data-factory.ua/open-court-fin'

    constructor(private http: HttpClient) {}
    
    getCourts(skip: number = 0, limit: number = 1000): Observable<Court[]> {
        return this.http.get<CourtResponse>(`${this.url}/api/v0/OpenCourt/get_courts?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.courts)
          );
      }
      getRegions(skip: number = 0, limit: number = 1000): Observable<Region[]> {
        return this.http.get<RegionResponse>(`${this.url}/api/v0/OpenCourt/get_regions?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.regions)
          )
      }
      getJusticeKind(skip: number = 0, limit: number = 10): Observable<JusticeKind[]> {
        return this.http.get<JusticeKindResponse>(`${this.url}/api/v0/OpenCourt/get_justice_kind?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.justice_kinds)
          )
      }
      getCategoryCodes(skip: number = 0, limit: number = 1500): Observable<Category[]> {
        return this.http.get<CategoryResponse>(`${this.url}/api/v0/OpenCourt/get_category_codes/1?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.categories)
          )
      }
      getCategoryCodes2(skip: number = 0, limit: number = 1500): Observable<Category[]> {
        return this.http.get<CategoryResponse>(`${this.url}/api/v0/OpenCourt/get_category_codes/2?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.categories)
          )
      }
      getCategoryCodes3(skip: number = 0, limit: number = 1500): Observable<Category[]> {
        return this.http.get<CategoryResponse>(`${this.url}/api/v0/OpenCourt/get_category_codes/3?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.categories)
          )
      }
      getCategoryCodes4( skip: number = 0, limit: number = 1500): Observable<Category[]> {
        return this.http.get<CategoryResponse>(`${this.url}/api/v0/OpenCourt/get_category_codes/4?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.categories)
          )
      }
      getCategoryCodes5(skip: number = 0, limit: number = 1500): Observable<Category[]> {
        return this.http.get<CategoryResponse>(`${this.url}/api/v0/OpenCourt/get_category_codes/5?skip=${skip}&limit=${limit}`)
          .pipe(
            map(response => response.categories)
          )
      }
  }