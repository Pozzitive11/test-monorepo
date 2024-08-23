import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReqCheckPageComponent } from './req-check-page.component'

describe('ReqCheckPageComponent', () => {
  let component: ReqCheckPageComponent
  let fixture: ComponentFixture<ReqCheckPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReqCheckPageComponent]
    })
    fixture = TestBed.createComponent(ReqCheckPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
