import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReqCheckAutoComponent } from './req-check-auto.component'

describe('ReqCheckAutoComponent', () => {
  let component: ReqCheckAutoComponent
  let fixture: ComponentFixture<ReqCheckAutoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReqCheckAutoComponent]
    })
    fixture = TestBed.createComponent(ReqCheckAutoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
