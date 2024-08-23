import { CanDeactivateFn } from '@angular/router'
import { Observable } from 'rxjs'

export interface ICanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const CanDeactivateGuard: CanDeactivateFn<ICanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true
}
