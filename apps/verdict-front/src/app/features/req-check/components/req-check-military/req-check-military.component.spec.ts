import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReqCheckMilitaryComponent } from './req-check-military.component'

describe('ReqCheckMilitaryComponent', () => {
  let component: ReqCheckMilitaryComponent
  let fixture: ComponentFixture<ReqCheckMilitaryComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReqCheckMilitaryComponent]
    })
    fixture = TestBed.createComponent(ReqCheckMilitaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
