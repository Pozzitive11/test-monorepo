import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReqCheckDevPageComponent } from './req-check-dev-page.component'

describe('ReqCheckDevPageComponent', () => {
  let component: ReqCheckDevPageComponent
  let fixture: ComponentFixture<ReqCheckDevPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReqCheckDevPageComponent]
    })
    fixture = TestBed.createComponent(ReqCheckDevPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
