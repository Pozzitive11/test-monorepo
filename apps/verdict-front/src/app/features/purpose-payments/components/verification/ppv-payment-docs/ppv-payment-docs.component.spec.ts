import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PpvPaymentDocsComponent } from './ppv-payment-docs.component'

describe('PpvPaymentDocsComponent', () => {
  let component: PpvPaymentDocsComponent
  let fixture: ComponentFixture<PpvPaymentDocsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PpvPaymentDocsComponent]
    })
    fixture = TestBed.createComponent(PpvPaymentDocsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
