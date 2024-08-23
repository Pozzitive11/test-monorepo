import { inject, Injectable, signal, Type } from '@angular/core'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { objectIsSignal } from '../utils/typing.utils'
import { IConfirmationModalComponentModel } from '../components/confirmation-modal/confirmation-modal.component.model'
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  readonly modalService = inject(NgbModal)

  runModalComponent$<I extends {}, T, R>(
    inputs: Partial<I>,
    component: Type<T>,
    options?: NgbModalOptions,
    throwError: boolean = false
  ): Observable<R> {
    const modalRef = this.modalService.open(component, options)
    Object.keys(inputs).forEach((key) => {
      const inputValue = (inputs as any)[key]
      if (objectIsSignal(modalRef.componentInstance[key])) {
        modalRef.componentInstance[key] = objectIsSignal(inputValue) ? inputValue : signal(inputValue)
      } else {
        modalRef.componentInstance[key] = objectIsSignal(inputValue) ? inputValue() : inputValue
      }
    })

    return new Observable((observer) => {
      modalRef.result.then((result: R) => {
        observer.next(result)
        observer.complete()
      }).catch(() => {
        if (throwError) observer.error()
        else observer.complete()
      })
    })
  }

  runConfirmModal$(inputs: Partial<IConfirmationModalComponentModel> = {}, options: NgbModalOptions = { centered: true }, throwError: boolean = false) {
    return this.runModalComponent$<IConfirmationModalComponentModel, ConfirmationModalComponent, boolean | string | null>(
      inputs,
      ConfirmationModalComponent,
      options,
      throwError
    )
  }

}
