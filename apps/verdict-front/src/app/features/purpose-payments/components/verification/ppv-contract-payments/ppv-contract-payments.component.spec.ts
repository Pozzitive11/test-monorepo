import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PpvContractPaymentsComponent } from './ppv-contract-payments.component'

describe('PpvContractPaymentsComponent', () => {
  let component: PpvContractPaymentsComponent
  let fixture: ComponentFixture<PpvContractPaymentsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PpvContractPaymentsComponent]
    })
    fixture = TestBed.createComponent(PpvContractPaymentsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
