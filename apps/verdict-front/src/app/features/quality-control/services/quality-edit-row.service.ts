import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class QualityEditRow {
  private idSource = new BehaviorSubject<string>('') // Используйте тип вашего id
  currentId = this.idSource.asObservable()

  changeId(id: string) {
    this.idSource.next(id)
  }
}
