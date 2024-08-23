import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReqCheckCreditTableComponent } from './req-check-credit-table.component'

describe('ReqCheckCreditTableComponent', () => {
  let component: ReqCheckCreditTableComponent
  let fixture: ComponentFixture<ReqCheckCreditTableComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReqCheckCreditTableComponent]
    })
    fixture = TestBed.createComponent(ReqCheckCreditTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
