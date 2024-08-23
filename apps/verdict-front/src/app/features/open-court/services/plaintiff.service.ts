import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PlaintiffService {
  private plaintiffNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')

  setPlaintiffName(name: string): void {
    this.plaintiffNameSubject.next(name)
  }

  get plaintiffName$(): Observable<string> {
    return this.plaintiffNameSubject.asObservable()
  }
}
